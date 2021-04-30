import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

import { ValidationErrorItem } from 'joi';

import { createUserValidatorSchema } from '../models/User';

const validatorsMap = new Map<string, ObjectSchema>([
  ['/users', createUserValidatorSchema]
]);

const generateResponseMessage = (validationErrorItems: ValidationErrorItem[]): string => {
  const generatedMessage = validationErrorItems.reduce(
    (chainedMessages: string, currentItem: ValidationErrorItem) => {
      return chainedMessages.concat(`${currentItem.message}, `);
    },
    ''
  );

  return generatedMessage.slice(0, -1);
};

const requestValidator = (req: Request, res: Response, next: NextFunction) => {
  const schema = validatorsMap.get(req.path);

  const { error } = schema!.validate(req.body, { abortEarly: false });

  if (error) {
    const generatedResponseMessage = generateResponseMessage(error.details);

    return res.status(400).json({
      error: 'Validation Error',
      message: generatedResponseMessage
    });
  }

  next();
}

export default requestValidator;
