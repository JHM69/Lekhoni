import cloudinary
import cloudinary.uploader
from uuid import uuid4
import requests

# Configure Cloudinary with your credentials
cloudinary.config(
  cloud_name='dcx547o84',
  api_key='532381275671923',
  api_secret='mHke7sN1PCQEsKhuZbOWOvCOGc8'
)

def upload_image(url):
    file_name = f"temp/{uuid4()}.jpg"
    response = requests.get(url)
    with open(file_name, 'wb') as f:
        f.write(response.content)
    upload_response = cloudinary.uploader.upload(file_name)
    print(upload_response['url'])
    return upload_response['url']

