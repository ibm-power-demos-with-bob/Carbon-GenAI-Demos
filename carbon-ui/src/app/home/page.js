'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
} from '@carbon/react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <Grid className="landing-page" fullWidth>
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        <Breadcrumb noTrailingSlash aria-label="Page navigation">
          <BreadcrumbItem>
            <a href="/">Getting started</a>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="landing-page__heading">Private GenAI for LSEG's data and streaming estate, on IBM Power</h1>
      </Column>
      <Column lg={16} md={8} sm={4} className="landing-page__r2">
        <Tabs defaultSelectedIndex={0}>
          <TabList className="tabs-group" aria-label="Tab navigation">
            <Tab>About</Tab>
            <Tab>Secure</Tab>
            <Tab>Flexible</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column md={4} lg={7} sm={4} className="landing-page__tab-content">
                  <h3 className="landing-page__subheading">GenAI on IBM Power, next to your event streams</h3>
                  <p className="landing-page__p">
                    LSEG's markets, data and risk businesses all run on real-time events.
                    GenAI running on IBM Power can read, classify and summarise the text
                    around those events (incident emails, client calls, bid documents,
                    onboarding memos) without needing expensive and energy hungry GPUs.
                    It uses open source Granite models, augmented by the Matrix Math
                    Accelerator designed into IBM Power10 and Power11 servers. Confluent
                    is now part of IBM, and SCC can bring both together as one accountable
                    UK partner.
                  </p>
                  <Button>Learn more</Button>
                </Column>
                <Column md={4} lg={{ span: 8, offset: 7 }} sm={4}>
                  <Image
                    className="landing-page__illo"
                    src="https://newsroom.ibm.com/image/Power11-Launch-SocialKit_Banner.png"
                    alt="IBM Power based on Power11 illustration"
                    width={604}
                    height={498}
                  />
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column lg={16} md={8} sm={4} className="landing-page__tab-content">
                  <p className="landing-page__p">
                    For a regulated market operator, resilience and data control are
                    first principles. Client communications, KYC and sanctions material,
                    and unreleased index or settlement information can be processed
                    inside IBM Power, without leaving your control and without a call to
                    a public cloud API. IBM Power also has orders of magnitude fewer
                    security vulnerabilities in the virtualisation that is in the heart of
                    every IBM Power server, lowering the surface area that can be attacked
                    by bad actors.
                  </p>
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column lg={16} md={8} sm={4} className="landing-page__tab-content">
                  <p className="landing-page__p">
                    These demos use the Granite 4.0 model, running in this IBM Power virtual
                    server, which was downloaded from Huggingface. You can easily swap this
                    model for others, such as Mistral or the Llama models from Meta, and run
                    different models in different virtual servers for different divisions
                    (Data &amp; Analytics, FTSE Russell, Risk Intelligence, Markets). You are
                    not restricted to the resources in GPUs, or to the model served by a
                    given provider. The sample data in this environment is entirely
                    fictional, and no figures should be treated as LSEG's own.
                  </p>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
      <Column lg={16} md={8} sm={4} className="landing-page__r3">
        <Grid>
          <Column lg={4} md={2} sm={4}>
            <h3 className="landing-page__label">The Principles</h3>
          </Column>
          <Column
            lg={{ start: 5, span: 3 }}
            md={{ start: 3, span: 6 }}
            sm={4}
            className="landing-page__title"
            style={{ textAlign: 'center' }}>
            <h4>💾 Data Locality</h4>
            <div>Run GenAI models next to your streams and systems of record</div>
          </Column>
          <Column
            lg={{ start: 9, span: 3 }}
            md={{ start: 3, span: 6 }}
            sm={4}
            className="landing-page__title"
            style={{ textAlign: 'center' }}>
            <h4>🔒 Security</h4>
            <div>Keep client and market data inside your boundary</div>
          </Column>
          <Column
            lg={{ start: 13, span: 3 }}
            md={{ start: 3, span: 6 }}
            sm={4}
            className="landing-page__title"
            style={{ textAlign: 'center' }}>
            <h4>⚡ Reliability</h4>
            <div>Legendary reliability for always-on markets infrastructure</div>
          </Column>
        </Grid>
      </Column>
    </Grid>
  );
}

// Made with Bob
