const Model = require("./venue.model");

const venueCreate = async (payload) => {
  const venue = await Model.create(payload);
  return {data:venue, msg:"Venue Created successfully"}
};

const getVenue = async()=>{
const data = await Model.find()
return {data:data, msg:"All Venue List"}
}
module.exports={venueCreate, getVenue}