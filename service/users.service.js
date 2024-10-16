// const User = require("../models/User");


// exports.existUserService = async (userEmail) => {
//     const user = await User.findOne({ email: userEmail });
//     return user;
// }

// exports.signUpService = async (userEmail, userInfo) => {
//     const user = await User.updateOne(
//         { email: userEmail },
//         { $set: userInfo },
//         {
//             upsert: true,  // Create a new document if none exists
//             new: true, // Return the updated/new document
//             runValidators: true // Enable schema validation
//         }
//     );
//     return user;
// }