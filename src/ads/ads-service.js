const xss = require('xss')

const AdsService = { 
  getAllAds(db){
    return db
      .from('blogful_ads AS ad')
      .select( 
        'ad.id',
        'ad.make', 
        'ad.model',
        'ad.year',
        'ad.mileage', 
        'ad.content', 
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id',usr.id,
              'user_name',usr.user_name, 
              'full_name',usr.full_name, 
              'date_created',usr.date_created
              'date_modified',usr.date_modified
            )
          ) AS creator`
        ),
      )
      .leftJoin( 
        'carlist_user AS usr',
        'ad.creator_id', 
        'usr.id',
      )
      .groupBy('art.id','usr.id')
  },

  getById(db, id){
    return AdService.getAllAds(db)
    .where('ad.id', id)
    .first()
  },

  serializeAds(ads) { 
    const { creator } = ad
    return { 
      id: ad.id,
      make: ad.make, 
      model: ad.model, 
      year: ad.year,
      mileage: ad.mileage, 
      content: ad.content, 
      date_created: ad.date_created,
      creator: {
        id: creator.id, 
        user_name: creator.user_name, 
        full_name: creator.full_name, 
        date_created: creator.date_created,

      }, 
    }
  },
}

module.exports = AdsService