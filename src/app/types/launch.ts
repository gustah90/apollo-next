export interface Launch {
  id: string
  mission_name: string
  launch_date_utc: string
  launch_success: boolean | null
  launch_site: string
  details: string | null
  links: {
    mission_patch: string | null
    mission_patch_small: string | null
    article_link: string | null
    video_link: string | null
    wikipedia: string | null
    flickr_images: string[]
  }
  rocket: {
    rocket_name: string
    rocket_type: string
  }
}
