import { formatUTCDate } from '../../src/utils/date';

describe('date', () => {
  describe('formatUTCDate', () => {
    it('Should format the date based on UTC timezone', () => {
      const date = new Date('2022-01-22T00:00:00.000Z');

      const formattedDate = formatUTCDate(date);

      expect(formattedDate).toBe('2022-01-22');
    });
  });
});
