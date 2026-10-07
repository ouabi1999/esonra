export const CURRENCY_CONFIG = {
    USD: {
        symbol: "$",
        locale: "en-US",
    },

    EUR: {
        symbol: "€",
        locale: "de-DE",
    },

    GBP: {
        symbol: "£",
        locale: "en-GB",
    },

    AED: {
        symbol: "د.إ",
        locale: "en-AE",
    },

    SAR: {
        symbol: "﷼",
        locale: "en-SA",
    },
};

export const convertPrice = (
    usdPrice,
    currency,
    rates
) => {
    const price = Number(usdPrice);

    if (!Number.isFinite(price)) {
        return 0;
    }

    if (currency === "USD") {
        return price;
    }

    const rate = rates?.[currency];

    if (!rate) {
        return price;
    }

    return price * rate;
};

export const formatPrice = ( usdPrice, currency, rates) => {

    const convertedPrice = convertPrice(
        usdPrice,
        currency,
        rates
    );

    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;

    return new Intl.NumberFormat(
        config.locale,
        {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(convertedPrice);
};