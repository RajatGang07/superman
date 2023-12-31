// done
const INSIGHT_FIELDS = [
  "date_start",
  "date_stop",
  "spend",
  "impressions",
  "frequency",
  "cpm",
  "cpc",
  "ctr",
  "inline_link_clicks",
  "location",
  "objective",
  "account_name",
  "adset_name",
  "reach",
  "video_p50_watched_actions",
  "buying_type",
  "clicks",
  "account_currency",
  "unique_outbound_clicks",
  "unique_inline_link_clicks",
  "actions",
  "adset_id",
  "ad_id",
  "ad_name",
  "campaign_id",
  "account_id",
  "created_time",
  "conversions",
  "unique_clicks",
  "outbound_clicks",
];


const ADSET_FIELDS = ["effective_status"];

// added
const ADSET_INSIGHT = [ "date_start", "date_stop", "dma"];

// added
const CAMPAIGN_FIELDS = [
  "daily_budget",
  "lifetime_budget",
  "stop_time",
  "configured_status",
  "start_time",
  "campaign_name",
  "bid_strategy",
];

// done
const ACCOUNT_LEVEL = [
  "spend_cap",
  "timezone_name",
  "timezone_id",
  "amount_spent",
];

// done
const AD_CREATIVES = ["name", "object_type", "link_url"];

// done
const ADSET_LEVEL = [
  "bid_amount",
  "bid_strategy",
  "lifetime_budget",
  "daily_budget",
];

exports.ADSET_FIELDS = ADSET_FIELDS;
exports.INSIGHT_FIELDS = INSIGHT_FIELDS;
exports.CAMPAIGN_FIELDS = CAMPAIGN_FIELDS;
exports.ACCOUNT_LEVEL = ACCOUNT_LEVEL;
exports.AD_CREATIVES = AD_CREATIVES;
exports.ADSET_LEVEL = ADSET_LEVEL;
exports.ADSET_INSIGHT = ADSET_INSIGHT;
