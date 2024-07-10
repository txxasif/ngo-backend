const { userFromAndMemberShipFeeHelper, loanInterestHelper } = require("./reportHepler");


async function incomeVsExpenseHelper(from, to) {
    const [membershipFee, loanInterest] = await Promise.all([
        userFromAndMemberShipFeeHelper(from, to),
        loanInterestHelper(from, to)
    ])

    return {
        membershipFee,
        loanInterest,
    }
}

module.exports = incomeVsExpenseHelper;