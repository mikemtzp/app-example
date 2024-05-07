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
    // Would be good if the issue was in the query
    const query = `
      query {
        customPageCollection(limit: 1, preview: ${isNotProduction}, where: { permalink: "${customPageSlug}" }) {
          items {
            blocksCollection {
              items {
                __typename
                ... on Grid {
                  __typename
                  type
                  sys {
                    id
                  }
                  columns
                  title
                  blocksCollection(limit: 4) {
                    items {
                      __typename
                      ... on Card {
                        __typename
                        sys {
                          id
                        }
                        title
                        image {
                          height
                          url
                          title
                          width
                        }
                        bodyRt {
                          json
                        }
                        imageAlignment
                        link {
                          label
                          url
                        }
                      }
                      ... on PlanCard1 {
                        __typename
                        sys {
                          id
                        }
                        buttonText
                        buttonColor
                        cornerTagAnnually
                        cornerTagMonthly
                        description
                        planLabel
                        planName
                        priceAnnually
                        priceMonthly
                        priceLabelAnnually {
                          json
                        }
                        priceLabelMonthly {
                          json
                        }
                        link {
                          label
                          url
                        }
                        planCardBenefitsCollection {
                          items {
                            __typename
                            title
                            benefitsList
                          }
                        }
                      }
                      
                      ... on Template {
                        __typename
                        sys {
                          id
                        }
                        title
                        permalink
                        url
                        demoUrl
                        badge {
                          badgeTitle
                          badgeTitleColor
                          badgeColor
                        }
                        desktopImagesCollection(limit: 8) {
                          items {
                            __typename
                            sys {
                              id
                            }
                            title
                            description
                            url
                            height
                            width
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
                        sys {
                          id
                        }
                        title
                      wideContent
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const { data } = await this.contentfulCall(query);
    return data.customPageCollection.items[0].blocksCollection.items || [];
  }

  static async getCustomPageProps(
    customPageSlug: SlugParam
  ): Promise<{ blocks: any[]; page: any }> {
    const allBlocks: any[] = [];
    let pageData: {
      metaTitle: string;
      metaDescription: string;
      permalink: string;
    } | null = null;

    // We had to separate the query into 2 parts (The second on named 'fetchBlocks') due to query complexity maximum capacity
    const fetchBlocks = async (): Promise<void> => {
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
      allBlocks.push(...blocks);

      if (!pageData) {
        pageData = {
          metaTitle: data.customPageCollection.items[0].metaTitle,
          metaDescription: data.customPageCollection.items[0].metaDescription,
          permalink: data.customPageCollection.items[0].permalink,
        };
      }
    };

    await fetchBlocks();

    const gridBlocks = await this.getGridBlocks(customPageSlug);

    const gridBlock = gridBlocks.find((block) => block.__typename === 'Grid');
    if (gridBlock) {
      const gridBlockIndex = allBlocks.findIndex(
        (block) => block.__typename === 'Grid'
      );

      if (gridBlockIndex !== -1) {
        allBlocks[gridBlockIndex] = gridBlock;
      } else {
        allBlocks.push(gridBlock);
      }
    }

    return { blocks: allBlocks, page: pageData };
  }
}
