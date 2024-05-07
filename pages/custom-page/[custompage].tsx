import { useContentfulLiveUpdates } from '@contentful/live-preview/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import {
  ContentfulBannerPricing,
  ContentfulCopy,
  ContentfulCopyWithImageSection,
  ContentfulCTA,
  ContentfulFaqSection,
  ContentfulGrid,
  ContentfulHero,
  ContentfulJobs,
  ContentfulListSection,
  ContentfulRichElement,
  ContentfulTestimonialPanel,
  ContentfulTitleBox,
  ContentfulVideoBlock,
  MasterPageProps,
  PeriodValue,
} from 'types';

import Copy from '@/components/Home/Copy';
import Grid from '@/components/Home/Grid';
import GridPricing from '@/components/Home/GridPricing';
import Hero from '@/components/Home/Hero';
import HeroVideo from '@/components/Home/HeroVideo';
import OpeningJobs from '@/components/Jobs/OpeningJobs';
import FaqSection from '@/components/Layout/FaqSection/FaqSection';
import Layout from '@/components/Layout/Layout';
import TitleBox from '@/components/PagePresentation/TitleBox';
import BannerPricing from '@/components/Pricing/BannerPricing';
import CopyWithImageSection from '@/components/Utils/CopyWithImageSection';
import CTA from '@/components/Utils/CTA';
import useWindowSize from '@/components/Utils/hooks/useWindowSize';
import ListSection from '@/components/Utils/ListSection';
import TestimonialPanel from '@/components/Utils/TestimonialPanel';
import { CustomPageAPI } from '@/contentfulAPI/custompages';
import DataStructure from '@/helpers/dataStructure';
import { isBlockOfType, SCREEN_TABLET } from '@/helpers/helpers';
import richRenderOptions from '@/helpers/RichRenderOptions';

export const getStaticPaths: GetStaticPaths = async () => {
  const allCustomPages = await CustomPageAPI.getAllCustomPages();

  const paths = allCustomPages.map(({ permalink }) => {
    return {
      params: {
        custompage: `${permalink}`,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { blocks, page } = await CustomPageAPI.getCustomPageProps(
    params?.custompage
  );

  return {
    props: {
      blocks,
      page,
    },
  };
};

const annuallyView = false;

const CustomPage = ({ blocks, page }: MasterPageProps) => {
  const { permalink, metaTitle, metaDescription } = page;
  const [switchPeriodValue] = useState<PeriodValue>('Monthly');

  // Here the useContentfulLiveUpdates hook is applied
  const updatedBlocks = useContentfulLiveUpdates(blocks);

  const { width } = useWindowSize();
  const screenSize = width >= 769 ? 'desk' : 'mobile';

  const canonicalUrl = `/custom-page/${permalink}`;

  const dataInfo = {
    description: metaDescription,
    title: metaTitle,
    price: '0.0',
    url: `https://www.bigcartel.com${canonicalUrl}`,
  };

  return (
    <Layout
      canonicalHref={canonicalUrl}
      dataStructure={DataStructure(dataInfo, 'product')}
      description={metaDescription}
      title={metaTitle}
    >
      <>
        {/* This is just a bunch of the updated components being rendered based on their content type on Contentful */}
        {updatedBlocks.map((block) => {
          switch (block.__typename) {
            case 'Banner':
              if (
                isBlockOfType<ContentfulBannerPricing>(block, block.__typename)
              ) {
                return <BannerPricing {...block} key={block.title} />;
              }

            case 'Copy':
              if (isBlockOfType<ContentfulCopy>(block, block.__typename)) {
                return <Copy {...block} key={block.title} titleType='h1' />;
              }

            case 'CopyWithImageSection':
              if (
                isBlockOfType<ContentfulCopyWithImageSection>(
                  block,
                  block.__typename
                )
              ) {
                return (
                  <CopyWithImageSection
                    block={block}
                    key={block.title}
                    screenSize={screenSize}
                  />
                );
              }

            case 'Cta':
              if (isBlockOfType<ContentfulCTA>(block, block.__typename)) {
                return <CTA cta={block} key={block.title} />;
              }

            case 'FaqSection':
              if (
                isBlockOfType<ContentfulFaqSection>(block, block.__typename)
              ) {
                return (
                  <FaqSection
                    faqSection={block}
                    marginTop={false}
                    key={block.title}
                  />
                );
              }

            case 'Grid':
              if (isBlockOfType<ContentfulGrid>(block, block.__typename)) {
                {
                  return block.type === 'Pricing' ? (
                    <GridPricing
                      {...block}
                      annuallyView={annuallyView}
                      spaceBottom={width > SCREEN_TABLET ? 185 : 40}
                      key={block.title}
                      switchPeriodValue={switchPeriodValue}
                    />
                  ) : (
                    <Grid {...block} key={block.title} spaceBottom={10} />
                  );
                }
              }

            case 'Hero':
              if (isBlockOfType<ContentfulHero>(block, block.__typename)) {
                return block.type === 'Video' ? (
                  <HeroVideo
                    {...block}
                    isMobile={width > SCREEN_TABLET ? false : true}
                    key={block.title}
                  />
                ) : (
                  <Hero
                    {...block}
                    isMobile={width > SCREEN_TABLET ? false : true}
                    key={block.title}
                    darkColor={false}
                  />
                );
              }

            case 'Jobs':
              if (isBlockOfType<ContentfulJobs>(block, block.__typename)) {
                return <OpeningJobs {...block} key={block.title} />;
              }

            case 'ListSection':
              if (
                isBlockOfType<ContentfulListSection>(block, block.__typename)
              ) {
                return (
                  <ListSection
                    {...block}
                    isMobile={width > SCREEN_TABLET ? false : true}
                    key={block.title}
                  />
                );
              }

            case 'TestimonialPanel':
              if (
                isBlockOfType<ContentfulTestimonialPanel>(
                  block,
                  block.__typename
                )
              ) {
                return <TestimonialPanel {...block} key={block.title} />;
              }

            case 'TitleBox':
              if (isBlockOfType<ContentfulTitleBox>(block, block.__typename)) {
                return <TitleBox title={block.title} key={block.title} />;
              }

            case 'RichElement':
              if (
                isBlockOfType<ContentfulRichElement>(block, block.__typename)
              ) {
                return (
                  <section className='main-container' key={block.title}>
                    {documentToReactComponents(
                      block.content.json,
                      richRenderOptions(block.content.links)
                    )}
                  </section>
                );
              }

            case 'VideoBlock':
              if (
                isBlockOfType<ContentfulVideoBlock>(block, block.__typename)
              ) {
                return (
                  <div
                    className='main-container video-player'
                    dangerouslySetInnerHTML={{ __html: block.postUrl }}
                    key={block.title}
                  ></div>
                );
              }

            default:
              null;
          }
        })}
      </>
    </Layout>
  );
};

export default CustomPage;
