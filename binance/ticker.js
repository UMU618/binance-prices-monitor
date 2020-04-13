/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const conf = require('../conf')
const assert = require('assert')
const fetch = require('node-fetch')

module.exports = {
  get24hr: function (symbol) {
    assert(symbol, 'no symbol')
    return fetch(conf.baseUrl + '/api/v1/ticker/24hr?symbol=' + symbol)
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        else {
          console.log('API failed, status = ' + res.status)
          return null
        }
      }
      , (e) => {
        console.error('Call API failed, error: ' + e)
        return null
      })
  }
}
