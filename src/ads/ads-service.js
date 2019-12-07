const xss = require('xss')

const AdsService = { 
  getAllAds(db){
    return db
      .from('carlist_ads')
      .select('*')

      // .select( 
      //   'ad.id',
      //   'ad.make', 
      //   'ad.model',
      //   'ad.car_year',
      //   'ad.mileage', 
      //   'ad.content', 
      //   db.raw(
      //     `json_strip_nulls(
      //       json_build_object(
      //         'id',usr.id,
      //         'username',usr.username, 
      //         'full_name',usr.full_name, 
      //         'phone',use.phone,
      //         'email',usr.email,
      //         'date_created',usr.date_created
      //         'date_modified',usr.date_modified
      //       )
      //     ) AS "author"`
      //   ),
      // )
      // .leftJoin( 
      //   'carlist_users AS usr',
      //   'ad.author_id', 
      //   'usr.id',
      // )
      // .groupBy('ad.id','usr.id')
  },

  getById(db, id){
    return AdService.getAllAds(db)
    .where('ad.id', id)
    .first()
  },

  serializeAds(ads) { 
    const { author } = ad
    return { 
      id: ad.id,
      make: ad.make, 
      model: ad.model, 
      car_year: ad.car_year,
      photos_link: ad.photo_link,
      mileage: ad.mileage, 
      content: ad.content, 
      date_created: new Date(ad.date_created),
      author: {
        id: author.id, 
        username: author.username, 
        full_name: author.full_name, 
        phone: author.phone,
        email: author.email,
        date_created: new Date(author.date_created),
      }, 
    }
  },
}

module.exports = AdsService