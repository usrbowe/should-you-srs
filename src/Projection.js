import { Divider, Row, Col, Alert, Typography, Timeline } from 'antd';
import { formatter, compundInterest, getTax } from './utils';
import { COLORS } from './constants';

// savingPeriod - ammount of years saved into SRS
// taxSavings - how much saved while contributing to SRS
const Projection = ({
  savingPeriod,
  annualSRS,
  taxSavings,
  interestRate,
  earlyWithdral,
}) => {
  // Calculations
  const totalWithInterest = compundInterest(
    annualSRS,
    savingPeriod,
    interestRate
  );
  const interestAccrued = totalWithInterest - annualSRS * savingPeriod;
  // 50% of withdrawal each year is taxed (this assumes no other income)
  const taxableAmmount = totalWithInterest / 2;
  const payableTax = getTax(taxableAmmount).payable;
  const earlyWithdrawalFee = earlyWithdral ? totalWithInterest * 0.05 : 0;
  const savedOnTaxes = taxSavings * savingPeriod;

  // No fee withdrawal 40k each year
  const withdrawalPeriod = Math.ceil(totalWithInterest / 40000);
  // Maximum is 10 years
  const cappedPeriod = Math.min(Math.max(withdrawalPeriod, 1), 10);
  const annualWithdrawal = totalWithInterest / cappedPeriod;
  // Tax on the 50% withdrawal
  const annualWithdrawalTax = getTax(annualWithdrawal / 2);
  // Ammount of money saved by using SRS and "postponing" pay taxes
  const savedDifferenceFee =
    savedOnTaxes +
    interestAccrued -
    (totalWithInterest - (totalWithInterest - payableTax - earlyWithdrawalFee));
  // Same but for normal upto 10 year withdrawal at 62 y/o
  const savedDifference =
    savedOnTaxes + interestAccrued - annualWithdrawalTax.payable * cappedPeriod;
  const savedDiff = earlyWithdral ? savedDifferenceFee : savedDifference;

  // Combined total tax on withdrawed funds
  const totalWithdarawalTaxes = earlyWithdral
    ? payableTax
    : annualWithdrawalTax.payable * cappedPeriod;
  return (
    <>
      Your total balance will be (+ interest):
      <br />
      <strong style={{ color: COLORS.green, fontSize: 18 }}>
        {formatter(totalWithInterest)}
      </strong>
      <br />
      <Row justify='center'>
        <Col xs={24} md={18}>
          <Divider />
          <Typography.Title level={4}>
            Timeline of your SRS investment
          </Typography.Title>
          <Timeline
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 6,
              borderColor: COLORS.lightGrey,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            <Timeline.Item color={'blue'}>
              <strong>{new Date().toLocaleDateString()}</strong> - Create SRS
              account with 1$ to lock in 62 y/o retirement
            </Timeline.Item>
            <Timeline.Item color={'gray'}>
              {' '}
              <span style={{ color: COLORS.darkGrey }}>
                few months later...
              </span>
            </Timeline.Item>
            <Timeline.Item color={'green'}>
              <strong>
                {new Date(
                  // 90 - days later
                  Date.now() + 3600 * 24 * 90 * 1000
                ).toLocaleDateString()}
              </strong>{' '}
              - Start lowering tax with saving{' '}
              <strong style={{ color: COLORS.green }}>
                +{formatter(annualSRS)}
              </strong>{' '}
              annually into SRS account
            </Timeline.Item>
            <Timeline.Item color={'gray'}>
              <span style={{ color: COLORS.darkGrey }}>
                <strong>
                  {savingPeriod} year{savingPeriod > 1 ? 's' : ''}
                </strong>{' '}
                later...
              </span>
            </Timeline.Item>
            <Timeline.Item color={'green'}>
              <strong>
                {new Date(
                  Date.now() + 3600 * 24 * 30 * 12 * savingPeriod * 1000
                ).toLocaleDateString()}
              </strong>{' '}
              - Stop saving into SRS
              {earlyWithdral && ' and request withdrawal of'}:{' '}
              <strong style={{ color: COLORS.green }}>
                {formatter(totalWithInterest)}
              </strong>
            </Timeline.Item>
            {earlyWithdral ? (
              <>
                <Timeline.Item color={'red'}>
                  Pay taxes on 50% of withdrawn ammount:{' '}
                  <strong style={{ color: COLORS.red }}>
                    -{formatter(payableTax)}
                  </strong>
                </Timeline.Item>
                <Timeline.Item color={'red'}>
                  Early withdrawal 5% penalty:{' '}
                  <strong style={{ color: COLORS.red }}>
                    -{formatter(earlyWithdrawalFee)}
                  </strong>
                </Timeline.Item>
                <Timeline.Item color={'green'}>
                  Final received ammount:{' '}
                  <strong style={{ fontSize: 14, color: COLORS.green }}>
                    {formatter(
                      totalWithInterest - payableTax - earlyWithdrawalFee
                    )}
                  </strong>
                </Timeline.Item>
              </>
            ) : (
              <>
                <Timeline.Item color={'gray'}>
                  <span style={{ color: COLORS.darkGrey }}>
                    X years later once <strong>reached 62 y/o</strong>...
                  </span>
                </Timeline.Item>
                {cappedPeriod > 1 ? (
                  <Timeline.Item color={'green'}>
                    First withdrawal of{' '}
                    <strong style={{ color: COLORS.green }}>
                      {formatter(annualWithdrawal)}
                    </strong>{' '}
                    out of {cappedPeriod}. Taxes to be paid:
                    <strong style={{ color: COLORS.red }}>
                      -{formatter(annualWithdrawalTax.payable)}
                    </strong>
                    .<br />
                    Net withdrawal:{' '}
                    <strong style={{ fontSize: 18, color: COLORS.green }}>
                      {formatter(
                        annualWithdrawal - annualWithdrawalTax.payable
                      )}
                    </strong>
                  </Timeline.Item>
                ) : (
                  <Timeline.Item color={'green'}>
                    Withdraw all{' '}
                    <strong style={{ color: COLORS.green }}>
                      {formatter(annualWithdrawal)}
                    </strong>{' '}
                    at once.
                  </Timeline.Item>
                )}
                {cappedPeriod > 1 && (
                  <>
                    <Timeline.Item color={'gray'}>
                      {cappedPeriod - 1}{' '}
                      {cappedPeriod - 1 > 1 ? 'years' : 'year'} later of annual
                      withdrawals...
                    </Timeline.Item>
                    <Timeline.Item color={'green'}>
                      Last withdrawal of{' '}
                      <strong style={{ color: COLORS.green }}>
                        {formatter(annualWithdrawal)}
                      </strong>
                    </Timeline.Item>
                  </>
                )}
              </>
            )}
          </Timeline>
          <Divider />
          In other words, you {savedDiff > 0 ? 'saved' : 'lost'} this ammount by
          reducing your taxes via SRS scheme:
          <br />
          <strong
            style={{
              fontSize: 18,
              color: savedDiff > 0 ? COLORS.green : COLORS.red,
            }}
          >
            {formatter(savedDiff)}
          </strong>
          <Divider />
          <Alert
            message='Explanation'
            description={
              <>
                Ammount not paid on taxes: {formatter(savedOnTaxes)}
                <br />
                Accrued interested: {formatter(interestAccrued)}
                <br />
                {earlyWithdral && (
                  <>
                    5% early withdrawal fee: -{formatter(earlyWithdrawalFee)}
                    <br />
                  </>
                )}
                {totalWithdarawalTaxes > 0 && (
                  <>
                    Taxes paid on withdrawal: -
                    {formatter(totalWithdarawalTaxes)}
                  </>
                )}
              </>
            }
            type='info'
          />
        </Col>
      </Row>
    </>
  );
};

export default Projection;
