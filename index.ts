import sig from 'signale'
import { Promise as bb } from 'bluebird'
import Chance from 'chance'

import log from './utils/log'
import flattenGQLResponse from './utils/flattenGQLResponse'
import warn from './utils/warn'
import consoleWrite from './utils/consoleWrite'
import spinner from './lib/spinner'
import { head } from 'ramda'
import { GraphQLError } from 'graphql'
import { ErrorCodes } from '@strider/nest-gql-playground/src/common/errors'

sig.config ({
	displayScope: true,
	displayBadge: false,
	displayDate: false,
	displayFilename: true,
	displayLabel: true,
	displayTimestamp: true,
	underlineLabel: true,
	underlineMessage: false,
	underlinePrefix: false,
	underlineSuffix: false,
	uppercaseLabel: false
})

const chance = new Chance ()

// isStrictEqual
function isSE (act?: unknown, exp?: unknown) {
	return expect
	(act).toStrictEqual (exp)
}

/**
 * returns or throws provided default value / Error
 *
 * 0 considered a truthy value to prevent bugs
 */

function toDefault<T> (maybeFalsy: T | undefined, orElse: Error | T): T {
	// @ts-ignore
	if (!maybeFalsy && maybeFalsy !== 0) {
		if (orElse instanceof Error) {
			throw orElse
		}
		return orElse
	}
	return maybeFalsy as T
}

export type FieldDecorator = (target: object, propertyKey: string) => void
const composeFieldDecorators = (...decorators: FieldDecorator[]): FieldDecorator => (target, propertyKey) =>
	decorators.forEach (decorator => decorator (target, propertyKey))

const composeClassDecorators = (...decorators: ClassDecorator[]): ClassDecorator => target => {
	decorators.forEach (decorator => decorator (target))
}
export const shouldHaveFailedValidation = ([data, errors]: [any, GraphQLError[]], amount = 1) => {
	isSE (data, null)
	isSE (head (errors)?.extensions?.code, ErrorCodes.VALIDATION_ERROR)
	if (amount)
		isSE (head (errors)
			?.extensions?.validationErrors.length, amount)
}
export const shouldHaveErrorCode = (errors: GraphQLError[], code: ErrorCodes) => {
	isSE (head (errors)?.extensions?.code, code)
}
export * from './utils/testing/supertest'
export {
	sig,
	log,
	bb,
	flattenGQLResponse,
	warn,
	consoleWrite,
	chance,
	isSE,
	spinner,
	composeFieldDecorators,
	composeClassDecorators,
	toDefault
}
