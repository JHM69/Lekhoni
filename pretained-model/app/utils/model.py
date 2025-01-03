from transformers import pipeline

class Translator:
    def __init__(self):
        # Initialize the translation pipeline with source and target languages
        self.model = pipeline(
            "translation", 
            model="fms-byte/banglish_to_bangla", 
            src_lang="en_XX",      # Source Language (Banglish)
            tgt_lang="bn_BD"       # Target Language (Bangla)
            
        )

    def translate_text(self, text: str) -> str:
        # Perform translation and return the result
        result = self.model(text)[0]['translation_text']
        return result
