import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbutils from '../helpers/dbutils.js';
import authService from './auth.js';
import authConfig from '../config/authconfig.js';

const SQL_INSERT_MEMBER = `
  INSERT INTO Member(
    firstName,
    lastName,
    homeAddress,
    mailAddress,
    phoneNumber,
    email,
    username,
    password)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

const SQL_INSERT_BUSINESS = `
  INSERT INTO Organization(
    verified,
    registrationDate,
    incorporated,
    incorporatedName,
    incorporatedOwners,
    contactFirstName,
    contactLastName,
    contactPhone,
    username,
    password,
    organizationName,
    organizationWebsite,
    organizationLogoURL,
    organizationMainPhone,
    organizationAltPhone,
    organizationEmail,
    national,
    organizationStreetAddress,
    organizationMailingAddress,
    organizationPostalCode)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const SQL_INSERT_SEARCHABLE_INFO = `
  INSERT INTO SearchableInfo(
    memberId,
    genderId,
    birthYear,
    familyStatusId,
    minMonthlyBudget,
    maxMonthlyBudget,
    petRestrictions,
    petRestrictionsText,
    healthRestrictions,
    healthRestrictionsText,
    religionRestrictions,
    religionRestrictionsText,
    smokingRestrictions,
    smokingRestrictionsText,
    dietRestrictions,
    dietRestrictionsText,
    allergies,
    allergiesText,
    hasHousing,
    minHomeCapacity,
    maxHomeCapacity,
    housingDescription,
    profileText)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const SQL_INSERT_LOCATION_PREFERENCE = `INSERT INTO LocationPreference(memberId, locationId) VALUES (?, ?)`;

async function signup(data) {
  let available = await authService.checkAvailable(data.username, data.email);
  if (!available) {
    return { err: 'Credentials unavailable.' };
  }

  console.log(data);

  // Insert Member
  let pwHash = bcrypt.hashSync(data.password);
  let result = await dbutils.query(SQL_INSERT_MEMBER, [
    data.firstName,
    data.lastName,
    data.homeAddress,
    data.mailAddress,
    data.phoneNumber,
    data.email,
    data.username,
    pwHash,
  ]);
  let memberId = result.insertId;

  console.log('passed step 1');

  // Insert SearchableInfo
  await dbutils.query(SQL_INSERT_SEARCHABLE_INFO, [
    memberId,
    data.genderId,
    data.birthYear,
    data.familyStatusId,
    data.minMonthlyBudget,
    data.maxMonthlyBudget,
    data.petRestrictions,
    data.petRestrictionsText,
    data.healthRestrictions,
    data.healthRestrictionsText,
    data.religionRestrictions,
    data.religionRestrictionsText,
    data.smokingRestrictions,
    data.smokingRestrictionsText,
    data.dietRestrictions,
    data.dietRestrictionsText,
    data.allergies,
    data.allergiesText,
    data.hasHousing,
    data.minHomeCapacity,
    data.maxHomeCapacity,
    data.housingDescription,
    data.profileText,
  ]);

  console.log('passed step 2');

  // Insert LocationPreferences
  for (const locationId of data.locationIds) {
    await dbutils.query(SQL_INSERT_LOCATION_PREFERENCE, [memberId, locationId]);
  }

  return { success: true };
}

async function businessSignup(data) {
  let available = await authService.checkBusinessAvailable(data.username, data.organizationEmail);
  if (!available) {
    return { err: 'Credentials unavailable.' };
  }

  console.log(data);

  // Insert Organization
  let pwHash = bcrypt.hashSync(data.password);
  let result = await dbutils.query(SQL_INSERT_BUSINESS, [
    data.verified,
    new Date(),
    data.incorporated,
    data.incorporatedName,
    data.incorporatedOwners,
    data.contactFirstName,
    data.contactLastName,
    data.contactEmail,
    data.contactPhone,
    data.username,
    pwHash, 
    data.organizationName,
    data.organizationWebsite,
    data.organizationLogoURL,
    data.organizationMainPhone,
    data.organizationAltPhone,
    data.organizationEmail,
    data.national,
    data.organizationStreetAddress,
    data.organizationMailingAddress,
    data.organizationPostalCode,
  ]);

  console.log('passed step 1');

  return { success: true };
}

// function login(username, password) {
//   return new Promise((resolve, reject) => {
//     let sql = `SELECT id, username, password FROM Member WHERE username = ?`;
//     dbutils
//       .query(sql, [username])
//       .then((results) => {
//         let user = results[0];
//         if (!user) {
//           resolve({ err: 'User not found.' });
//           return;
//         }

//         if (!bcrypt.compareSync(password, user.password)) {
//           resolve({ err: 'Invalid password.' });
//           return;
//         }

//         let token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });
//         resolve({
//           id: user.id,
//           username: user.username,
//           accessToken: token,
//         });
//       })
//       .catch((reason) => {
//         console.log(reason);
//         reject(reason);
//       });
//   });
// }

function login(username, password) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT id, username, password FROM Member WHERE username = ?`;
    dbutils
      .query(sql, [username])
      .then((results) => {
        let user = results[0];
        if (!user) {
          resolve({ err: 'User not found.' });
          return;
        }

        if (!bcrypt.compareSync(password, user.password)) {
          resolve({ err: 'Invalid password.' });
          return;
        }

        let token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });
        resolve({
          id: user.id,
          username: user.username,
          accessToken: token,
        });
      })
      .catch((reason) => {
        console.log(reason);
        reject(reason);
      });
  });
}

export default {
  signup,
  businessSignup,
  login,
};
