import { createLogger, transports, format } from 'winston';
import { TransformableInfo } from 'logform';

const customFormat = (info: TransformableInfo): string => {
  const colorizer = format.colorize();
  const colorizedLabel = colorizer.colorize(info.level, `[${info.label}]`);
  const colorizedMessage = colorizer.colorize(info.level, info.message);

  return `${colorizedLabel} - ${info.timestamp} - ${colorizedMessage}`;
};
const logger = createLogger({
  transports: [
    new transports.Console()
  ],
  format: format.combine(
    format.timestamp({ format: 'MM/dd/YYYY, HH:mm:ss' }),
    format.printf(customFormat)
  )
});

export default logger;
