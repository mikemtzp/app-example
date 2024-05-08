import { CustomAllPages, SlugParam } from 'types';

import { isNotProduction } from '../helpers';
import { ContentfulAPI } from './contentfulAPI';

export class CustomPageAPI extends ContentfulAPI {
  static async getAllCustomPages(): Promise<CustomAllPages[]> {
    // isNotProduction just returns true or false if the deployment is on production(bigcartel.com) or staging(bigcartel.biz)
    // Right now we are using the staging site for use in Live Preview
    const query = `
      query {
        customPageCollection(preview: ${isNotProduction}) {
          items {
            permalink
          }
        }
      }
    `;

    // 'contentfulCall' method connects to Contentful API to get the data from the space, environment using acces key to access draft content
    const { data } = await this.contentfulCall(query);
    return data.customPageCollection.items || [];
  }

  static async getGridBlocks(customPageSlug: SlugParam): Promise<any[]> {
    // All the data in the queries supossedly already have the sys.id and __typename for every type of content or collection
    // Updated this part so only 1 query is used. Already tried it in the GraphQL Playground and it updates correctly.
    const query = `
      query {
          customPageCollection(limit: 1, preview: ${isNotProduction}, where: { permalink: "${customPageSlug}" }) {
            items {
      sys {
        id
      }
      title
      permalink
      metaTitle
      metaDescription
      blocksCollection(limit: 10) {
        items {
          __typename
          ... on TitleBox {
            __typename
            sys {
              id
            }
            title
          }

          ... on Copy {
            __typename
            sys {
              id
            }
            title
            bodyRt {
              json
            }
            callToAction {
              label
              url
            }
          }

          ... on CopyWithImageSection {
            __typename
            sys {
              id
            }
            title
            titleSection
            bodyRt {
              json
            }
            imageDesktop {
              url
              title
              width
              height
            }
            imageMobile {
              url
              title
              width
              height
            }
            imagePosition
            callToAction {
              amplitudeTag
              label
              url
            }
          }

          ... on Hero {
            __typename
            sys {
              id
            }
            title
            body
            type
            callToAction {
              label
              url
            }
            backgroundImage {
              url
              title
            }
            backgroundImageMobile {
              url
              title
            }
            videoDesktopWebm {
              title
              url
            }
            videoDesktopMp4 {
              title
              url
            }
            videoMobileWebm {
              title
              url
            }
            videoMobileMp4 {
              title
              url
            }
          }

          ... on ListSection {
            __typename
            sys {
              id
            }
            title
            listLefttop {
              json
            }
            listRightbottom {
              json
            }
            backgroundImage {
              url
              title
            }
            backgroundImageMobile {
              url
              title
            }
            callToAction {
              label
              url
            }
          }

          ... on RichElement {
            __typename
            sys {
              id
            }
            title
            content {
              json
              links {
                assets {
                  block {
                    sys {
                      id
                    }
                    fileName
                    url
                    width
                    height
                  }
                }
                entries {
                  block {
                    sys {
                      id
                    }
                    __typename

                    ... on VideoBlock {
                      __typename
                      sys {
                        id
                      }
                      title
                      postUrl
                    }

                    ... on FeaturedImage {
                      __typename
                      sys {
                        id
                      }
                      title
                      alternativeText
                      captionText
                      url
                      image {
                        fileName
                        url
                        width
                        height
                      }
                      size
                    }
                  }
                }
              }
            }
          }

          ... on TemplateCta {
            __typename
            sys {
              id
            }
            borders
            sideLeft {
              __typename
              ... on Image {
                __typename
                sys {
                  id
                }
                image {
                  height
                  title
                  url
                  width
                }
              }
              ... on TemplateContent {
                __typename
                sys {
                  id
                }
                content {
                  json
                }
              }
            }
            sideRight {
              __typename
              ... on Image {
                __typename
                sys {
                  id
                }
                image {
                  height
                  title
                  url
                  width
                }
              }
              ... on TemplateContent {
                __typename
                sys {
                  id
                }
                content {
                  json
                }
              }
            }
            title
            wideContent
          }

          ... on VideoBlock {
            __typename
            sys {
              id
            }
            title
            postUrl
          }

          ... on Jobs {
            __typename
            sys {
              id
            }
            title
            recruiteeJobsUrl
          }

          ... on TestimonialPanel {
            __typename
            sys {
              id
            }
            title
            testimonialsCollection(limit: 4) {
              items {
                __typename
                ... on Card {
                  __typename
                  sys {
                    id
                  }
                  title
                  bodyRt {
                    json
                  }
                  image {
                    url
                    width
                    height
                    title
                  }
                }
              }
            }
          }

          ... on Banner {
            __typename
            sys {
              id
            }
            title
            isBelowHero
            bannerCardsCollection {
              items {
                sys {
                  id
                }
                __typename

                ... on PlanBenefits {
                  __typename
                  sys {
                    id
                  }
                  title
                  icon {
                    title
                    url
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    }
  }
} `;

    const { data } = await this.contentfulCall(query);
    const blocks =
      data.customPageCollection.items[0].blocksCollection.items || [];

    const pageData =
      {
        metaTitle: data.customPageCollection.items[0].metaTitle,
        metaDescription: data.customPageCollection.items[0].metaDescription,
        permalink: data.customPageCollection.items[0].permalink,
      } || {};


    return { blocks: blocks, page: pageData };
  }
}
