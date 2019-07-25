/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

const conf = require('./conf')
const ticker = require('./binance/ticker')
const alerts = require('./utils/alerts')

let lastPrice = 0

setInterval(() => {
  ticker
    .get24hr(conf.symbol)
    .then((jo) => {
      if (jo && jo[0]) {
        const alert = compare24hr(jo[0].openPrice, jo[0].lastPrice)
        if (lastPrice != 0 && !alert) {
          compare(lastPrice, jo[0].lastPrice)
        }
        lastPrice = jo[0].lastPrice
      }
    })
}, conf.interval)

function compare24hr(open, close) {
  if (open < close) {
    // increasing
    if ((close - open) / open >= conf.last24hPrecent) {
      if (lastPrice == 0) {
        alerts.sendDingtalk(conf.dingtalkToken, conf.baseAsset + ' price increase to ' + close)
        return true
      } else {
        if (lastPrice < close) {
          alerts.sendDingtalk(conf.dingtalkToken, conf.baseAsset + ' price increase to ' + close)
          return true
        }
      }
    }
  } else {
    if ((open - close) / open >= conf.last24hPrecent) {
      if (lastPrice == 0) {
        alerts.sendDingtalk(conf.dingtalkToken, conf.baseAsset + ' price fall to ' + close)
        return true
      } else {
        if (lastPrice > close) {
          alerts.sendDingtalk(conf.dingtalkToken, conf.baseAsset + ' price fall to ' + close)
          return true
        }
      }
    }
  }
  return false
}

function compare(oldPrice, newPrice) {
  if (oldPrice < newPrice) {
    // increasing
    if ((newPrice - oldPrice) / oldPrice >= conf.diffPrecent) {
      alerts.sendDingtalk(conf.dingtalkToken, conf.baseAsset + ' price increase to ' + newPrice)
    }
  } else {
    if ((oldPrice - newPrice) / oldPrice >= conf.diffPrecent) {
      alerts.sendDingtalk(conf.dingtalkToken, conf.baseAsset + ' price fall to ' + newPrice)
    }
  }
}