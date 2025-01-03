import streamlit as st
from streamlit_option_menu import option_menu
from views import banglish

from dotenv import load_dotenv

load_dotenv()

st.title("Recipe Recommendation App")

with st.sidebar:
    menu = option_menu(
        menu_title='Menu',
        options=["Banglish"],
        default_index=0,
    )

if menu == "Banglish":
    banglish.show()




