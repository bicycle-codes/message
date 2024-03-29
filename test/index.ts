import * as odd from '@oddjs/odd'
import { components } from '@ssc-half-light/node-components'
import { test } from '@nichoth/tapzero'
import * as msg from '../dist/index.js'
import { SignedMessage } from '../dist/index.js'

let program

test('setup', async t => {
    program = await odd.assemble({
        namespace: { creator: 'test', name: 'testing' },
        debug: false
    }, components)

    t.ok(program, 'create a program')
})

let req:SignedMessage<{type:string, value:string}>

test('create request', async t => {
    const { crypto } = program.components

    req = await msg.create(crypto, { type: 'test', value: 'wooo' })
    t.ok(req, 'request was created')
    t.equal(typeof req.signature, 'string', 'should have a signature')
    t.ok(req.author.includes('did:key:'), 'should have an author field')
    t.equal(req.type, 'test', 'should have the properties we passed in')
})

test('verify a message', async t => {
    const isOk = await msg.verify(req)
    t.equal(isOk, true, 'should return true for a valid message')
})

test('verify an invalid message', async t => {
    const isOk = await msg.verify(Object.assign({ foo: 'bar' }, req))
    t.equal(isOk, false, 'should return false for an invalid message')
})
