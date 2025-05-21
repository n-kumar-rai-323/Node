const Model = require("./venue.model");

const venueCreate = async (payload) => {
  const venue = await Model.create(payload);
  return {data:venue, msg:"Venue Created successfully"}
};

const getVenue = async()=>{
const data = await Model.find()
return {data:data, msg:"All Venue List"}
}

const getVenueById = async(id)=>{ // Expecting 'id' as an argument
  const data = await Model.findById(id);
  return {data:data, msg:"List"};
}

const updateVenueById = async(id, payload)=>{ // Expecting 'id' and 'payload'
  const data = await Model.findByIdAndUpdate(id, payload, { new: true });
  return {data:data, msg:"Updated venue"};
}

const deletebyId = async(id)=>{ // Expecting 'id' as an argument
  const data = await Model.findByIdAndDelete(id); // Use findByIdAndDelete to delete
  return {data:data, msg:"Venue deleted"}; // Update the message to reflect deletion
}
module.exports={venueCreate, getVenue, getVenueById, updateVenueById, deletebyId}