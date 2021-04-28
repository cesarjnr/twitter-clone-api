import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

import { createUserValidatorSchema } from '../models/User';

const validatorsMap = new Map<string, ObjectSchema>([
  ['/users', createUserValidatorSchema]
]);

const requestValidator = (req: Request, res: Response, next: NextFunction) => {
  const schema = validatorsMap.get(req.path);

  const { error, value } = schema!.validate(req.body, { abortEarly: false });

  console.log(error!.details);

  res.json({ validated: true });
}

export default requestValidator;
