import './App.css';
import { useState, useReducer, useMemo } from 'react';
import {
  InputNumber,
  Switch,
  Form,
  Statistic,
  Row,
  Col,
  Button,
  Divider,
  Slider,
  Tabs,
  Modal,
} from 'antd';

import Projection from './Projection';
import { getTax, formatter, numericFormatter } from './utils';
import { YEAR_MARKS, COLORS } from './constants';

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
const dataState = {
  salary: 0,
  srs: 0,
  // Some meaingful default time to save?
  srsYears: 5,
  // Default interest rate on SRS account is 0.05%
  srsInterestRate: 0.05,
  // Recommended not to withdrad before 62 y/o
  earlyWithdral: false,
};

function App() {
  const [isCitizenPR, setCitizenPR] = useState(false);
  const [showSRSInfo, setShowSRSInfo] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const [data, dispatch] = useReducer(dataReducer, dataState);

  const tax = useMemo(() => {
    return getTax(data.salary);
  }, [data.salary]);

  const taxWithSRS = useMemo(() => {
    return getTax(data.salary - data.srs);
  }, [data.salary, data.srs]);

  const taxSavings = tax.payable - taxWithSRS.payable;

  // Reset
  // useEffect(() => {
  //   dispatch({
  //     type: 'update',
  //     payload: { srs: 0 },
  //   });
  // }, [isCitizenPR]);

  return (
    <div className='App'>
      <Row>
        <h1>Should you SRS? 🦄</h1>
      </Row>
      <Tabs
        type='card'
        defaultActiveKey='1'
        activeKey={activeKey}
        size={'large'}
        style={{ marginBottom: 32 }}
        onChange={(key) => setActiveKey(key)}
      >
        <Tabs.TabPane tab='SRS contribution 💰' key={'1'}>
          <Row>
            <Col xs={24} sm={12}>
              <Row gutter={{ xs: 8, lg: 16 }}>
                <Col span={24}>
                  <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 12 }}
                    layout='horizontal'
                  >
                    <Form.Item
                      label={'Are your Singaporean/PR?'}
                      name={'citizenPR'}
                      tooltip={{
                        title:
                          'Maximum annual contribution of S$15,300 for Singaporeans/PRs, and S$35,700 for Foreigners',
                      }}
                    >
                      <Switch
                        // checkedChildren='Citizen/PR'
                        // unCheckedChildren='Foreigner'
                        defaultChecked
                        onChange={(checked) => setCitizenPR(checked)}
                      />
                    </Form.Item>
                    <Form.Item label='Annual Salary' name='salary'>
                      <InputNumber
                        allowClear
                        formatter={numericFormatter}
                        parser={(value) => value.replace(/S\$\s?|(,*)/g, '')}
                        onChange={(value) =>
                          dispatch({
                            type: 'update',
                            payload: { salary: Number(value) },
                          })
                        }
                        size={'large'}
                        style={{ width: 200 }}
                        step={100}
                      />
                    </Form.Item>
                    <Form.Item label='Annual SRS contribution' name='srs'>
                      <InputNumber
                        formatter={numericFormatter}
                        parser={(value) => value.replace(/S\$\s?|(,*)/g, '')}
                        allowClear
                        onChange={(value) =>
                          dispatch({
                            type: 'update',
                            payload: { srs: Number(value) },
                          })
                        }
                        size={'large'}
                        min={0}
                        max={isCitizenPR ? 15300 : 35700}
                        style={{ width: 200 }}
                        // value={data.srs}
                        step={100}
                      />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={12}>
              <Row gutter={16}>
                <Col span={24}>
                  <Statistic
                    title='Current tax'
                    value={tax.payable || 0}
                    valueStyle={{ color: COLORS.red }}
                    suffix={'S$'}
                    precision={0}
                  />
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Statistic
                    title='Tax with SRS'
                    value={taxWithSRS.payable || 0}
                    valueStyle={{ color: COLORS.green }}
                    suffix={'S$'}
                    precision={0}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title='You will save on tax'
                    valueStyle={{ color: COLORS.green }}
                    value={taxSavings || 0}
                    suffix={'S$'}
                    precision={0}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Button
            type='primary'
            size={'large'}
            disabled={!data.salary || !data.srs}
            onClick={() => setActiveKey('2')}
          >
            Go to projections!
          </Button>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab='Future projections 🔮'
          key={'2'}
          disabled={!data.salary || !data.srs}
        >
          <Row>
            <Col span={24}>
              <Button onClick={() => setShowSRSInfo(true)}>
                Learn basic information about SRS
              </Button>
            </Col>
            <Modal
              title={'Basic information about SRS'}
              visible={showSRSInfo}
              onOk={() => setShowSRSInfo(false)}
              onCancel={() => setShowSRSInfo(false)}
            >
              While using SRS as a tax deduction tool, it's important to know
              some basics. To make things easier we will assume you have no
              other income (either retired or left Singapore).
              <br />
              <br />
              <strong>Saving into SRS</strong>
              <br />
              In general the best strategy is to deduct via SRS on taxes as much
              as possible (15k PR/Singaporean, 35,7k Foreigner).
              <br />
              <Divider />
              <strong>Withdrawal strategy</strong>
              <br />
              Another aspect is withdrawal. Where the recommended way is to wait
              until retirement age of 62 y/o. And withdraw money over period of
              10 years (maximum allowed period). <br />
              Also it's good to aim to save around <strong>400,000 S$</strong>
              , which in 10 years can be withdrawn with minimal tax. As only 50%
              of each withdrawal is taxable.
              <br />
              It's <strong>not recommended</strong> to do early withdrawal,
              which has 5% fee and also need to withdraw all at once. If you
              have more than 40k withdrawal, it would also be taxable.
            </Modal>
            <Col xs={24} md={18}>
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16, offset: 2 }}
                layout='horizontal'
              >
                <Form.Item
                  label={'How long you planning to save to SRS?'}
                  tooltip={{ title: 'Current retirement age is 62 y/o.' }}
                >
                  <Slider
                    min={1}
                    max={50}
                    marks={YEAR_MARKS}
                    defaultValue={data.srsYears}
                    onChange={(value) =>
                      dispatch({
                        type: 'update',
                        payload: { srsYears: value },
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={'Choose interest rate, based on your investment.'}
                  tooltip={{
                    title:
                      'Default SRS account only provides 0.05% interest rate, so its highly recommended to invest your SRS.',
                  }}
                >
                  <Slider
                    min={0.05}
                    max={20}
                    marks={{
                      0.05: '0.05% (default)',
                    }}
                    step={0.01}
                    defaultValue={data.srsInterestRate}
                    onChange={(value) =>
                      dispatch({
                        type: 'update',
                        payload: { srsInterestRate: value },
                      })
                    }
                  />
                </Form.Item>
                <Form.Item
                  label={'Withdraw funds before 62 y/o?'}
                  name={'penalty'}
                  tooltip={{
                    title:
                      'If SRS fund are withdrawn before 62 y/o there is 5% penalty.',
                  }}
                >
                  <Switch
                    defaultChecked={data.earlyWithdral}
                    onChange={(checked) => {
                      dispatch({
                        type: 'update',
                        payload: {
                          earlyWithdral: checked,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </Form>
              If you keep saving <strong>{formatter(data.srs)}</strong> annualy
              into your SRS account for <strong>{data.srsYears} years</strong>.
              <br />
              <Projection
                interestRate={data.srsInterestRate / 100}
                annualSRS={data.srs}
                savingPeriod={data.srsYears}
                taxSavings={taxSavings}
                earlyWithdral={data.earlyWithdral}
              />
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default App;
