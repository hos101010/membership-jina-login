check.make_alert();
check.render_page();
 
//로그인 페이지
document.getElementById("signin_id_input").addEventListener("blur", () => {
    check.check_id_condition('signin_id_input', 'signin_id_small');
}, false);

document.getElementById("signin_pw_input").addEventListener("blur", () => {
    check.check_password_condition('signin_pw_input', 'signin_pw_small', 0);
}, false);

document.getElementById("sign_in_button").addEventListener("click", () => {
    let id_check = check.check_id_condition('signin_id_input', 'signin_id_small');
    let password_check = check.check_password_condition('signin_pw_input', 'signin_pw_small', 0);
    if (id_check && password_check){
        document.getElementById('signin_form_goto_main').submit();
    }
}, false);

document.getElementById("sign_up_button").addEventListener("click", () => {
    document.getElementById('signin_form_goto_signup').submit();
}, false);


//회원가입 페이지
document.getElementById("id_input").addEventListener("blur", () => {
    if (check.check_id_condition('id_input', 'id_p'))
        check.check_id_duplication();
}, false);

document.getElementById("password_input").addEventListener("blur", () => {
    check.check_password_condition('password_input', 'password_p',1);
    if (document.getElementById("2nd_password_input").value != ''){
        check.check_password_coincidence();
    }
}, false);

document.getElementById("2nd_password_input").addEventListener("blur", () => {
    check.check_password_coincidence();
}, false);

document.getElementById("year_input").addEventListener("blur", () => {
    check.check_birthday_condition();
}, false);

document.getElementById("month_input").addEventListener("blur", () => {
    check.check_birthday_condition();
}, false);


document.getElementById("date_input").addEventListener("blur", () => {
    check.check_birthday_condition();
}, false);


document.getElementById("email_input").addEventListener("blur", () => {
    check.check_email_condition();
}, false);

document.getElementById("number_input").addEventListener("blur", () => {
    check.check_number_condition();
}, false);


document.getElementById("interest_div").addEventListener("click", () => {
    document.getElementById('interest_input').focus();
}, false);

document.getElementById("interest_input").addEventListener("keydown", () => {
    check.change_to_mutable();
}, false);


document.getElementById("interest_input").addEventListener("input", () => {
    check.set_interest_field();
}, false);

document.getElementById("interest_input").addEventListener("focus", () => {
    check.seton_border();
}, false);

document.getElementById("interest_input").addEventListener("blur", () => {
    check.setoff_border();
}, false);

document.getElementById("agreement_button").addEventListener("click", () => {
    check.pop_up_element('terms_popup_div','inline');
}, false);

document.getElementById("reset_button").addEventListener("click", () => {
    check.pop_up_element('reset_div','flex');
}, false);

document.getElementById("submit_button").addEventListener("click", () => {
    if (check.press_submit_button()){
        document.getElementById('hidden_input').value = JSON.stringify({ 'interests' : user.interests});
        document.getElementById('signup_form').submit();
    }
}, false);


//popup창
document.getElementById("turning_back_button").addEventListener("click", () => {
    check.hide_element('terms_popup_div');
}, false);

document.getElementById("agreement_textarea").addEventListener("scroll", () => {
    check.check_bottom_or_not();
}, false);


document.getElementById("terms_popup_agreement_button").addEventListener("click", () => {
    check.set_checkbox();
}, false);

document.getElementById("reset_cancle_button").addEventListener("click", () => {
    check.hide_element('reset_div');
}, false);


document.getElementById("reset_ok_button").addEventListener("click", () => {
    check.reset_all_input();
}, false);

document.getElementById("alert_ok_button").addEventListener("click", () => {
    check.hide_element('alert_div');
}, false);


//메인페이지
document.getElementById("goback_button").addEventListener("click", () => {
    document.getElementById('signout_form').submit();
}, false);