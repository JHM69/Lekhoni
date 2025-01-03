import streamlit as st
import helpers.openai_banglish as openai_banglish
import helpers.openai_improve_bangla as openai_improve_bangla


def show():
    st.title("Banglish to Bangla")

    st.text_area("Enter Banglish text", key="banglish_text", value="amr mon valo nei")

    if st.button("Translate", key="translate"):
        banglish_text = st.session_state.banglish_text
        bangla_text = openai_banglish.convert_to_bangla(banglish_text)
        st.write(bangla_text)

        st.write("Improved Bangla text")
        improved_text = openai_improve_bangla.improve_text(bangla_text)
        st.write(improved_text)





