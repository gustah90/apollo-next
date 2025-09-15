export type Distance = { meters: number | null; feet: number | null }
export type Mass = { kg: number | null; lb: number | null }
export type Thrust = { kN: number | null; lbf: number | null }

export type RocketEngines = {
  number: number | null
  type: string | null
  version: string | null
  layout: string | null
  engine_loss_max: string | null
  propellant_1: string | null
  propellant_2: string | null
  thrust_sea_level: Thrust | null
  thrust_vacuum: Thrust | null
  thrust_to_weight: number | null
}

export type RocketStageCommon = {
  engines: number | null
  fuel_amount_tons: number | null
  burn_time_sec: number | null
}

export type RocketFirstStage = RocketStageCommon & {
  reusable: boolean | null
  thrust_sea_level: Thrust | null
  thrust_vacuum: Thrust | null
}

export type RocketSecondStage = RocketStageCommon & {
  thrust: Thrust | null
  payloads: {
    option_1: string | null
    composite_fairing: {
      height: Distance | null
      diameter: Distance | null
    } | null
  } | null
}

export type PayloadWeight = { id: string; name: string; kg: number | null; lb: number | null }
export type RocketLandingLegs = { number: number | null; material: string | null }
export type Rocket = {
  id: string
  name: string | null
  type: string | null
  active: boolean | null
  stages: number | null
  boosters: number | null
  cost_per_launch: number | null
  success_rate_pct: number | null
  first_flight: string | null
  country: string | null
  company: string | null
  wikipedia: string | null
  description: string | null
  height: Distance | null
  diameter: Distance | null
  mass: Mass | null
  engines: RocketEngines | null
  landing_legs: RocketLandingLegs | null
  payload_weights: PayloadWeight[] | null
  first_stage: RocketFirstStage | null
  second_stage: RocketSecondStage | null
}

export type GetRocketsData = { rockets: Rocket[] | null }
