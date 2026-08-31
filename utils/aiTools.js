const Business = require("../models/businesses");
const UserPosts = require("../models/user-posts");

async function searchBusinesses({ query, location }) {
    const filter = {};
    if (query) {
        filter.$or = [
            {
                businessType: {
                    $regex: query,
                    $options: "i"
                }
            },
            {
                businessDescription: {
                    $regex: query,
                    $options: "i"
                }
            }
        ];
    }

    if (location) {
        filter.location = {
            $regex: location,
            $options: "i"
        };
    }

    return await Business
        .find(filter)
        .limit(10)
        .lean();
}


async function getLatestPosts() {
    return await UserPosts
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
}

module.exports = {
    searchBusinesses,
    getLatestPosts
};