import { equal } from 'zoroaster/assert'
import context, { Context } from '../context' // eslint-disable-line no-unused-vars
import idioDev from '../../src'

/** @type {Object.<string, (ctx: Context)>} */
const T = {
  context,
  'is a function'() {
    equal(typeof idioDev, 'function')
  },
  async 'calls package without error'() {
    await idioDev()
  },
  async 'calls test context method'({ example }) {
    await example()
  },
}

export default T
