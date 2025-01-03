from openai import OpenAI

def generate_image(image_desc):
    print(image_desc)

    client = OpenAI()
    response = client.images.generate(
        model="dall-e-3",
        prompt="generate a stunning thumbnail image for a story about: " + image_desc,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    print(response.data[0].url)
    return response.data[0].url