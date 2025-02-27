import dbutils from '../helpers/dbutils.js';

const SQL_SELECT_LISTINGS_BY_USER = `
  SELECT
    l.id AS id,
    approvalStatus,
    creationDate,
    title,
    website,
    phone,
    email,
    ratingAverage,
    ratingCount,
    startDate,
    endDate,
    description,
    locationId,
    c.id AS categoryId,
    c.name AS categoryName,
    o.id AS organizationId,
    o.organizationName AS organizationName
  FROM Listing l
  JOIN CategoryType c ON l.categoryId = c.id
  JOIN Organization o ON l.organizationId = o.id
  WHERE o.id = ?
`;

const SQL_SELECT_LISTING = `
  SELECT
    l.id AS id,
    approvalStatus,
    creationDate,
    title,
    subDescription,
    groupName,
    price,
    eventDate,
    eventTime,
    bedroomCount,
    bathroomCount,
    utilities,
    furnished,
    petRestrictions,
    smoking,
    forSale,
    forRent,
    streetAddress,
    postalCode,
    website,
    phone,
    email,
    ratingAverage,
    ratingCount,
    startDate,
    endDate,
    description,
    locationId,
    c.id AS categoryId,
    c.name AS categoryName,
    o.id AS organizationId,
    o.organizationName AS organizationName
  FROM Listing l
  JOIN CategoryType c ON l.categoryId = c.id
  JOIN Organization o ON l.organizationId = o.id
  WHERE l.id = ?
`;

const SQL_INSERT_LISTING = `
  INSERT INTO Listing(
    approvalStatus,
    creationDate,
    title,
    subDescription,
    groupName,
    price,
    eventDate,
    eventTime,
    bedroomCount,
    bathroomCount,
    utilities,
    furnished,
    petRestrictions,
    smoking,
    forSale,
    forRent,
    streetAddress,
    postalCode,
    website,
    phone,
    email,
    ratingAverage,
    ratingCount,
    startDate,
    endDate,
    description,
    imageURLs,
    locationId,
    categoryId,
    organizationId)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const SQL_UPDATE_LISTING = `
  UPDATE Listing
  SET
    title = ?,
    subDescription = ?,
    groupName = ?,
    price = ?,
    eventDate = ?,
    eventTime = ?,
    bedroomCount = ?,
    bathroomCount = ?,
    utilities = ?,
    furnished = ?,
    petRestrictions = ?,
    smoking = ?,
    forSale = ?,
    forRent = ?,
    streetAddress = ?,
    postalCode = ?,
    website = ?,
    phone = ?,
    email = ?,
    startDate = ?,
    endDate = ?,
    description = ?,
    locationId = ?,
    categoryId = ?
  WHERE id = ?
`;

const SQL_TEST_LISTING = `
  SELECT 
    city
  FROM Location
  WHERE id = ?
`;

const SQL_DELETE_LISTING = `DELETE FROM Listing WHERE id = ?`;

async function getListingsByUser(id) {
  return await dbutils.query(SQL_SELECT_LISTINGS_BY_USER, [id]);
}

async function getListing(id) {
  let results = await dbutils.query(SQL_SELECT_LISTING, [id]);
  if (results.length > 0) {
    return results[0];
  } else {
    return { err: 'Failed to find user with id: ' + id };
  }
}

async function createListing(listing) {
  await dbutils.query(SQL_TEST_LISTING, [
    listing.organizationId,
  ]);
  await dbutils.query(SQL_INSERT_LISTING, [
    true, // TODO: implement approval by admins
    new Date().toISOString(),
    listing.title || '',
    listing.subDescription || '',
    listing.groupName || '',
    listing.price || 0,
    listing.eventDate || new Date().toISOString(),
    listing.eventTime || 0,
    listing.bedroomCount || 0,
    listing.bathroomCount || 0,
    listing.utilities || false,
    listing.furnished || false,
    listing.petRestrictions || false,
    listing.smoking || false,
    listing.forSale || false,
    listing.forRent || false,
    listing.streetAddress || '',
    listing.postalCode || '',
    listing.website || '',
    listing.phone || '',
    listing.email || '',
    0,
    0,
    new Date().toISOString(), // TODO: Start date
    new Date().toISOString(), // TODO: End date
    listing.description || '',
    '',
    listing.locationId,
    listing.categoryId,
    listing.organizationId,
  ]);
  return { success: true };
}

async function editListing(id, listing) {
  await dbutils.query(SQL_UPDATE_LISTING, [
    listing.title,
    listing.subDescription,
    listing.groupName,
    listing.price,
    listing.eventDate,
    listing.eventTime,
    listing.bedroomCount,
    listing.bathroomCount,
    listing.utilities,
    listing.furnished,
    listing.petRestrictions,
    listing.smoking,
    listing.forSale,
    listing.forRent,
    listing.streetAddress,
    listing.postalCode,
    listing.website,
    listing.phone,
    listing.email,
    new Date().toISOString(), // TODO: Start date
    new Date().toISOString(), // TODO: End date
    listing.description,
    listing.locationId,
    listing.categoryId,
    id,
  ]);
}

async function deleteListing(id) {
  await dbutils.query(SQL_DELETE_LISTING, [id]);
}

export default {
  getListingsByUser,
  getListing,
  createListing,
  editListing,
  deleteListing,
};
