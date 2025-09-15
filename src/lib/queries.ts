import { gql } from 'graphql-request'

export const GET_LAUNCHES = gql`
  query GetLaunches($limit: Int, $offset: Int) {
    launches(limit: $limit, offset: $offset) {
      id
      mission_name
      launch_date_utc
      launch_success
      details
      links {
        mission_patch
        mission_patch_small
        article_link
        video_link
        wikipedia
        flickr_images
      }
      rocket {
        rocket_name
        rocket_type
      }
    }
  }
`

export const GET_LAUNCHES_SIMPLE = gql`
  query GetLaunchesSimple($limit: Int) {
    launches(limit: $limit) {
      id
      mission_name
      launch_date_utc
      launch_success
    }
  }
`

export const GET_LAUNCH_DETAILS = gql`
  query GetLaunchDetails($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      launch_date_utc
      launch_success
      details
      links {
        mission_patch
        mission_patch_small
        article_link
        video_link
        wikipedia
        flickr_images
      }
      rocket {
        rocket_name
        rocket_type
      }
      launch_site {
        site_name_long
      }
    }
  }
`
