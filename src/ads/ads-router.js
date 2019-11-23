const express = require('express')
const AdsService = require('./ads-service')
const { requireAuth } = require('../middleware/basic_auth')

const articlesRouter = express.Router()

adsRouter
  .route('/')
  .get((req,res,nex) => {
    AdsService.getAllAds(req.app.get('db'))
    .then(ad => { 
      console.log(ad)
      res.json(ads.map(AdsService.serializeAd)) 
    })
    .catch(next)
  })

adRouter
  .route('/:ad_id')
  .all(requireAuth)
  .all(checkAdExists)
  .get((req,res) => { 
    res.json(AdsService.serializeAd(res.ad))
  })  

  async function checkAdExists(req, res, next) { 
    try { 
      const ad = await AdService.getById(
        req.app.get('db'),
        req.params.ad_id
      )
      
      if(!ad)
        return res.status(404).json({ 
          error: `Article doesn't exist`
        })
      
      res.ad = ad 
      next()
    } catch (error) { 
      next(error)
    }
  }
module.exports = adRouter