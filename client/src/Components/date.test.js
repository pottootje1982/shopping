const getDateString = require('./date')

it('Returns date string', async () => {
  expect(getDateString(new Date(2020, 0, 1))).toEqual('2020-01-01 00:00:00')
})
