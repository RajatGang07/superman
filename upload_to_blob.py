import azure.storage.blob as blob_service

# Azure Blob Storage settings
account_url = "https://fbcampaign.blob.core.windows.net/";
account_key = "5De6RGDwL9pF24Nd6ckE1kXKp4Bpcck0Y2pA5+Kj560j4tfo07wOLZUHO2bnaK5CbZAF+GI1lFXo+AStu1Wpcg=="

container_name = "facebook-input"
blob_name = "fb_ads_data.csv"  # Specify the name of the blob in Azure Blob Storage

# Function to upload a file to Azure Blob Storage
def upload_to_azure_blob(file_path):
    try:
        # Create a BlobServiceClient using the connection string
        blob_service_client = blob_service.BlobServiceClient(account_url=account_url,credential=account_key)

        # Create a BlobClient for the container and blob
        container_client = blob_service_client.get_container_client(container_name)
        blob_client = container_client.get_blob_client(blob_name)

        # Upload the file to the blob
        with open(file_path, "rb") as data:
            try:
                blob_client.upload_blob(data, overwrite=True)
                print(f"File {file_path} uploaded to Azure Blob Storage successfully.")
            except Exception as e:
                print(f"An error occurred uploading the file: {e}")
        

    except Exception as e:
        print(f"An error occurred: {e}")
