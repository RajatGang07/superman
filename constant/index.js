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
  "buying_type",
  "campaign_id",
  "account_currency",
  "objective",
  "account_name",
  "adset_name",
  "account_id",
  "created_time",
  "conversions",
  "unique_clicks",
  "outbound_clicks",
  "unique_inline_link_clicks",
  "unique_outbound_clicks",
];

const ADSET_FIELDS = ["effective_status", "date_start", "date_stop", "dma"];

const CAMPAIGN_FIELDS = [
  "daily_budget",
  "lifetime_budget",
  "stop_time",
  "configured_status",
  "start_time",
  "campaign_name",
  "bid_strategy",
];

const ACCOUNT_LEVEL = [
  "spend_cap",
  "timezone_name",
  "timezone_id",
  "amount_spent",
];

const AD_CREATIVES = ["creative_name", "object_type", "link_url"];

const ADSET_LEVEL = [
  "instagram_permalink_url",
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
