import User from "../model/users.js";
import queryString from "query-string";
import Stripe from "stripe";

const stripe = Stripe(
  process.env.STRIPE_SECRET
);
// console.log(stripe);

export const makeInstructor = async (req, res) => {
  try {
    // 1. find user from db
    const user = await User.findById(req.user._id).exec();

    // 2. if user dont have stripe_account_id yet, then create new
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: "express" });
      user.stripe_account_id = account.id;

      user.save();
      // console.log(user);
    }
    //   3. create account link based on account id (for frontend to complete boarding)
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });
    //   // 4. pre-fill any info such as email(optional), then send url response  to frontend
    accountLink = await Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });
    console.log(accountLink);
    //   //   5. then  send the account link as response to frontend
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (error) {
    console.log(error);
  }
};
