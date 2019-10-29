import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as XhrServer from '../../lib/xhr_ws_server'

chai.use(chaiAsPromised)

describe('lib/xhr_ws_server', function () {
  context('#create', function () {
    let xhrServer

    beforeEach(function () {
      xhrServer = XhrServer.create()
    })

    it('resolves a response when incomingXhr is received before request', function () {
      xhrServer.onIncomingXhr('foo', 'bar')
      expect(xhrServer.getDeferredResponse('foo')).to.eq('bar')
    })

    it('resolves a response when incomingXhr is received after request', function () {
      const p = xhrServer.getDeferredResponse('foo')

      xhrServer.onIncomingXhr('foo', 'bar')

      return expect(p).to.eventually.deep.eq({ data: 'bar' })
    })

    it('rejects a response when incomingXhr is received and test gets reset', function () {
      const p = xhrServer.getDeferredResponse('foo')

      xhrServer.onBeforeTestRun()

      return expect(p).to.be.rejectedWith('This stubbed XHR was pending')
    })
  })
})
