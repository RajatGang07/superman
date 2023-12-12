import requests
import csv
import os

# Replace with your Facebook access token and Ad Account ID
access_token = "EAATV24vblZCsBO2YvzR7QRbNsZCdIYayov4FTfaKMoHmZCQg6ZClsEFnLPbjQVSd0ZBr2FDHVLmuYei3CzOzDoZBxKUtKPDeH5imFwu5XNso3oPJeeRmLQZBwFk46sMnCG0L7eJYG7zD469Dxyzlw7YSE5ZArNJ9foMt8foqm9vvm8InPigULK9ZAez41Xd5wZCAQ1Jjm9taJNOkZA8rgUOCgZDZD"
ad_account_id = 'act_362903427139242'

# Create a CSV file to store all the data
csv_filename = 'FBConnector/ad_data_with_insights.csv'

def fetch_and_store_facebook_data():

    # Step 1: Initialize the CSV file with a header
    with open(csv_filename, 'w', newline='', encoding='utf-8') as csv_file:
        csv_writer = csv.writer(csv_file)

        # Write the CSV header for ad data
        csv_header_ads = ['Account Id', 'Ad ID', 'Ad Name', 'Ad Set ID', 'Campaign Id', 'Ad Set status', 'Created time']
        
        # Customize the insights fields as needed
        insights_fields = ['date_start','date_stop','spend','impressions','frequency','cpm','cpc','ctr','inline_link_clicks','location','objective','account_name' ,'adset_name', 'reach','video_p50_watched_actions', 'buying_type', 'clicks', 'account_currency','unique_outbound_clicks','unique_inline_link_clicks']

        # Add specific action types to insights fields
        #actions_to_fetch = ['page_engagement', 'link_click']  # Add other action types as needed
        #for action_type in actions_to_fetch:
         #   insights_fields.append(f'actions.{action_type}')

        # Append insights fields to the ad data header
        csv_header_ads.extend(['Insights ' + field for field in insights_fields])

        csv_writer.writerow(csv_header_ads)

        try:
            # Step 2: Get all active Ads in the specified Ad Account
            url_ads = f'https://graph.facebook.com/v18.0/{ad_account_id}/ads'
            params_ads = {
                'access_token': access_token,
                'fields': 'account_id,id,name,adset_id,campaign_id,effective_status,created_time',
                'filtering': '[{"field":"effective_status","operator":"IN","value":["ACTIVE"]}]'
            }

            response_ads = requests.get(url_ads, params=params_ads)
            response_ads.raise_for_status()
            ads_data = response_ads.json()
            if 'data' in ads_data:
                for ad in ads_data['data']:
                    account_id = ad['account_id']
                    ad_id = ad['id']
                    ad_name = ad['name']
                    adset_id = ad['adset_id']
                    campaign_id = ad['campaign_id']
                    effective_status = ad['effective_status']
                    created_time = ad['created_time']

                    # Step 3: Get insights for the current ad
                    url_insights = f'https://graph.facebook.com/v18.0/{ad_id}/insights'
                    params_insights = {
                        'access_token': access_token,
                        'fields': ','.join(insights_fields), 
                    }

                    response_insights = requests.get(url_insights, params=params_insights)
                    response_insights.raise_for_status()
                    insights_data = response_insights.json()

                    # Initialize a dictionary to store ad data and insights
                    ad_data_with_insights = {
                        'Account Id': account_id,
                        'Ad ID': ad_id,
                        'Ad Name': ad_name,
                        'Ad Set ID': adset_id,
                        'Campaign Id': campaign_id,
                        'Ad Set status': effective_status,
                        'Created time': created_time,
                    }

                    # Add insights data to the dictionary
                    if 'data' in insights_data:
                        for insight in insights_data['data']:
                            ad_data_with_insights.update({'Insights ' + field: insight.get(field, '') for field in insights_fields})

                            # Extract and format 'unique_outbound_clicks'
                            if 'unique_outbound_clicks' in insight:
                                for outbound_click in insight['unique_outbound_clicks']:
                                    if outbound_click['action_type'] == 'outbound_click':
                                        ad_data_with_insights['Insights unique_outbound_clicks'] = outbound_click['value']
                            
                            # Extract and format 'unique_inline_link_clicks'
                            if 'unique_inline_link_clicks' in insight:
                                ad_data_with_insights['Insights unique_inline_link_clicks'] = insight['unique_inline_link_clicks']

                    # Step 5: Write the combined ad and insights data to the CSV file
                    csv_writer.writerow([ad_data_with_insights[key] for key in csv_header_ads])

        except requests.exceptions.HTTPError as e:
            print(f'Error: {e}')
        except Exception as e:
            print(f'An error occurred: {e}')

    print(f'Data has been saved to {csv_filename}')

if __name__ == "__main__":
# Call the function to fetch and store data from Facebook API and generate CSV
    fetch_and_store_facebook_data()

