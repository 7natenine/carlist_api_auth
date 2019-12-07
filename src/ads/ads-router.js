const express = require('express')
const AdsService = require('./ads-service')
const { requireAuth } = require('../middleware/basic_auth')

const adsRouter = express.Router()

adsRouter
  .route('/')
  .get((req,res,next) => {
    AdsService.getAllAds(req.app.get('db'))
    .then(ad => { 
      console.log(ad)
      res.json(ad) 
    })
    .catch(next)
  })


adsRouter
  .route('/:adId')
  .all(requireAuth)
  .all(checkAdExists)
  .get((req,res) => { 
    res.json(AdsService.serializeAd(res.ad))
  })  

  async function checkAdExists(req, res, next) { 
    try { 
      const ad = await AdService.getById(
        req.app.get('db'),
        req.params.adId
      )
      
      if(!ad)
        return res.status(404).json({ 
          error: `ad doesn't exist`
        })
      
      res.ad = ad 
      next()
    } catch (error) { 
      next(error)
    }
  }
module.exports = adsRouter