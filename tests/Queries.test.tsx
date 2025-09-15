/**
 * @jest-environment jsdom
 */
import {
  parse,
  type DocumentNode,
  type OperationDefinitionNode,
  Kind,
  type SelectionSetNode,
  type FieldNode,
  type TypeNode,
  type NamedTypeNode,
} from 'graphql'

jest.mock('graphql-request', () => {
  function gql(strings: TemplateStringsArray, ...expr: ReadonlyArray<unknown>): string {
    let out = ''
    strings.forEach((s, i) => {
      out += s
      if (i < expr.length) out += String(expr[i])
    })
    return out
  }
  return { __esModule: true, gql }
})

import { GET_LAUNCHES, GET_LAUNCHES_SIMPLE, GET_LAUNCH_DETAILS } from '@/lib/queries'

function getOperation(doc: DocumentNode): OperationDefinitionNode {
  const op = doc.definitions.find(
    (d): d is OperationDefinitionNode => d.kind === Kind.OPERATION_DEFINITION,
  )
  if (!op) throw new Error('Nenhuma operação encontrada.')
  return op
}

function fieldNamesFromOperation(op: OperationDefinitionNode): Set<string> {
  const names = new Set<string>()
  for (const sel of op.selectionSet.selections) {
    if (sel.kind === Kind.FIELD) names.add(sel.name.value)
  }
  return names
}

function getFieldSelectionSet(op: OperationDefinitionNode, field: string): SelectionSetNode {
  const node = op.selectionSet.selections.find(
    (sel): sel is FieldNode => sel.kind === Kind.FIELD && sel.name.value === field,
  )
  if (!node || !node.selectionSet) {
    throw new Error(`Campo "${field}" não encontrado ou sem selectionSet.`)
  }
  return node.selectionSet
}

function fieldNamesFromSelectionSet(sel: SelectionSetNode): Set<string> {
  const names = new Set<string>()
  for (const s of sel.selections) {
    if (s.kind === Kind.FIELD) names.add(s.name.value)
  }
  return names
}

function getNestedFieldSelectionSet(parent: SelectionSetNode, field: string): SelectionSetNode {
  const node = parent.selections.find(
    (s): s is FieldNode => s.kind === Kind.FIELD && s.name.value === field,
  )
  if (!node || !node.selectionSet) {
    throw new Error(`Subcampo "${field}" não encontrado ou sem selectionSet.`)
  }
  return node.selectionSet
}

function namedTypeName(t: TypeNode): string {
  if (t.kind === Kind.NAMED_TYPE) return (t as NamedTypeNode).name.value
  if (t.kind === Kind.NON_NULL_TYPE) return namedTypeName(t.type)
  if (t.kind === Kind.LIST_TYPE) return namedTypeName(t.type)
  return 'Unknown'
}

describe('GraphQL queries shape', () => {
  test('GET_LAUNCHES — nome, variáveis e campos esperados', () => {
    const doc = parse(String(GET_LAUNCHES))
    const op = getOperation(doc)

    expect(op.operation).toBe('query')
    expect(op.name?.value).toBe('GetLaunches')

    const vars = op.variableDefinitions ?? []
    const byName = new Map(vars.map((v) => [v.variable.name.value, v.type]))
    expect(namedTypeName(byName.get('limit')!)).toBe('Int')
    expect(namedTypeName(byName.get('offset')!)).toBe('Int')

    expect(fieldNamesFromOperation(op).has('launches')).toBe(true)

    const launchesSel = getFieldSelectionSet(op, 'launches')
    const launchesFields = fieldNamesFromSelectionSet(launchesSel)
    ;[
      'id',
      'mission_name',
      'launch_date_utc',
      'launch_success',
      'details',
      'links',
      'rocket',
    ].forEach((f) => expect(launchesFields.has(f)).toBe(true))

    const linksSel = getNestedFieldSelectionSet(launchesSel, 'links')
    const linksFields = fieldNamesFromSelectionSet(linksSel)
    ;[
      'mission_patch',
      'mission_patch_small',
      'article_link',
      'video_link',
      'wikipedia',
      'flickr_images',
    ].forEach((f) => expect(linksFields.has(f)).toBe(true))

    const rocketSel = getNestedFieldSelectionSet(launchesSel, 'rocket')
    const rocketFields = fieldNamesFromSelectionSet(rocketSel)
    ;['rocket_name', 'rocket_type'].forEach((f) => expect(rocketFields.has(f)).toBe(true))
  })

  test('GET_LAUNCHES_SIMPLE — nome, variável e campos esperados', () => {
    const doc = parse(String(GET_LAUNCHES_SIMPLE))
    const op = getOperation(doc)

    expect(op.operation).toBe('query')
    expect(op.name?.value).toBe('GetLaunchesSimple')

    const vars = op.variableDefinitions ?? []
    const byName = new Map(vars.map((v) => [v.variable.name.value, v.type]))
    expect(namedTypeName(byName.get('limit')!)).toBe('Int')

    const top = fieldNamesFromOperation(op)
    expect(top.has('launches')).toBe(true)

    const launchesSel = getFieldSelectionSet(op, 'launches')
    const fields = fieldNamesFromSelectionSet(launchesSel)
    ;['id', 'mission_name', 'launch_date_utc', 'launch_success'].forEach((f) =>
      expect(fields.has(f)).toBe(true),
    )
  })

  test('GET_LAUNCH_DETAILS — nome, variável e campos esperados', () => {
    const doc = parse(String(GET_LAUNCH_DETAILS))
    const op = getOperation(doc)

    expect(op.operation).toBe('query')
    expect(op.name?.value).toBe('GetLaunchDetails')

    const vars = op.variableDefinitions ?? []
    expect(vars).toHaveLength(1)
    const v = vars[0]
    expect(v.variable.name.value).toBe('id')
    expect(namedTypeName(v.type)).toBe('ID')

    const top = fieldNamesFromOperation(op)
    expect(top.has('launch')).toBe(true)

    const launchSel = getFieldSelectionSet(op, 'launch')
    const launchFields = fieldNamesFromSelectionSet(launchSel)
    ;[
      'id',
      'mission_name',
      'launch_date_utc',
      'launch_success',
      'details',
      'links',
      'rocket',
      'launch_site',
    ].forEach((f) => expect(launchFields.has(f)).toBe(true))

    const linksSel = getNestedFieldSelectionSet(launchSel, 'links')
    const linksFields = fieldNamesFromSelectionSet(linksSel)
    ;[
      'mission_patch',
      'mission_patch_small',
      'article_link',
      'video_link',
      'wikipedia',
      'flickr_images',
    ].forEach((f) => expect(linksFields.has(f)).toBe(true))

    const rocketSel = getNestedFieldSelectionSet(launchSel, 'rocket')
    const rocketFields = fieldNamesFromSelectionSet(rocketSel)
    ;['rocket_name', 'rocket_type'].forEach((f) => expect(rocketFields.has(f)).toBe(true))

    const siteSel = getNestedFieldSelectionSet(launchSel, 'launch_site')
    const siteFields = fieldNamesFromSelectionSet(siteSel)
    expect(siteFields.has('site_name_long')).toBe(true)
  })
})
