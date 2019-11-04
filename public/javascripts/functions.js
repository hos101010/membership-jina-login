const user = {
    id : null,
    password : null,
    name : null,
    birthday_year : null,
    birthday_month : null,
    birthday_date : null,
    gender : null,
    email : null,
    number : null,
    interests : []
}

const check = {
    check_id_condition(input, output, print_pass){
        user.id = document.getElementById(input).value;
        if (/^[a-z0-9_-]{5,20}$/.test(user.id)){
            document.getElementById(output).innerHTML="";
            return 1;
        }else{
            document.getElementById(output).innerHTML=err_msg.under_msg['id_fail'];
            return 0;
        }
    },

    
    check_id_duplication(){
        fetch('/id_duplication_check', {
            method: 'POST',
            body: JSON.stringify({id : user.id}),
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            if (response.unique == true){
                document.getElementById('id_p').innerHTML=err_msg.under_msg['id_pass'];
            }
            else {
                document.getElementById('id_p').innerHTML=err_msg.under_msg['id_duplication'];
            }
        })
        .catch(error => console.error('Error:', error));

    },

    check_password_condition(input, output, print_pass){
        user.password = document.getElementById(input).value;
        if (user.password.length<8 || user.password.length>16)
            document.getElementById(output).innerHTML=err_msg.under_msg['pw_length'];
        else if (!/[A-Z]/.test(user.password))
            document.getElementById(output).innerHTML=err_msg.under_msg['pw_upper'];
        else if (!/[a-z]/.test(user.password))
            document.getElementById(output).innerHTML=err_msg.under_msg['pw_lower'];
        else if (!/[0-9]/.test(user.password))
            document.getElementById(output).innerHTML=err_msg.under_msg['pw_number'];
        else if (!/[~!@\\#$%<>^&*_-]/.test(user.password))
            document.getElementById(output).innerHTML=err_msg.under_msg['pw_special'];
        else {
            if (print_pass) document.getElementById(output).innerHTML=err_msg.under_msg['pw_pass'];
            else document.getElementById(output).innerHTML="";
            return 1;
        }
        return 0;
    },

    check_password_coincidence(){
        if (user.password == document.getElementById("2nd_password_input").value)
            document.getElementById("2nd_password_p").innerHTML=err_msg.under_msg['same_pw'];
        else
            document.getElementById("2nd_password_p").innerHTML=err_msg.under_msg['diff_pw'];
        
    },

    check_birthday_condition(){
        if (document.getElementById("year_input").value != '' && document.getElementById("month_input").value != '' && document.getElementById("date_input").value != ''){
            if (this.check_year_condition())
                this.check_date_condition();
        }
        else {
            document.getElementById("birthday_p").innerHTML=err_msg.under_msg['bday_no_input'];
        }
    },

    check_year_condition(){
        user.birthday_year = document.getElementById("year_input").value;        
        let now = new Date();
        if (!/^[0-9]{4}$/.test(user.birthday_year))
            document.getElementById("birthday_p").innerHTML=err_msg.under_msg['bday_four_letter'];
        else if (now.getFullYear()-user.birthday_year<14)
            document.getElementById("birthday_p").innerHTML=err_msg.under_msg['bday_too_young'];
        else if (now.getFullYear()-user.birthday_year>98)
            document.getElementById("birthday_p").innerHTML=err_msg.under_msg['bday_too_old'];
        else{
            document.getElementById("birthday_p").innerHTML="";
            return 1;
        }
        return 0;
    },

    check_date_condition(){
        user.birthday_month = document.getElementById("month_input").value;        
        user.birthday_date = document.getElementById("date_input").value;
        let lastday = new Date(user.birthday_year, user.birthday_month, 0);
        if (!/^[0-9]{0,2}$/.test(user.birthday_date) || user.birthday_date < 1 || user.birthday_date > lastday.getDate())
            document.getElementById("birthday_p").innerHTML=err_msg.under_msg['bday_over_date'];
        else{
            document.getElementById("birthday_p").innerHTML="";
            return 1;
        }
        return 0;
    },

    check_email_condition(){
        user.email = document.getElementById("email_input").value;
        if (!/^.+@.+\..+$/.test(user.email))
            document.getElementById("email_p").innerHTML=err_msg.under_msg['email_fail'];
        else
            document.getElementById("email_p").innerHTML="";
    },

    check_number_condition(){
        user.number = document.getElementById("number_input").value;
        if (!/^010[0-9]{7,8}$/.test(user.number))
            document.getElementById("number_p").innerHTML=err_msg.under_msg['number_fail'];
        else
            document.getElementById("number_p").innerHTML="";        
    },

    set_interest_field(){
        let interest_input = document.getElementById("interest_input");
        if (/,/.test(interest_input.value)){
            if (interest_input.value == ',')
                interest_input.value = '';
            else {
                user.interests.push(interest_input.value.substr(0,interest_input.value.length-1));
                this.draw_interest_tag();
                document.getElementById("interest_input").focus();
            }
        }
        this.check_tag_quantity();
    },

    draw_interest_tag(){
        let code_inside_innerHTML = '';
        for(let i=0; i<user.interests.length; i++){
            code_inside_innerHTML += "<span class='interest_tag'>" + user.interests[i] + "<input class='delete_button' type='button' value='x' name='"+i+"' onclick='check.delete_interest();'></span>"
        }            
        code_inside_innerHTML += "<input class='text_input' id='interest_input' type='text' onKeyDown='check.change_to_mutable();' onfocus='check.seton_border();' onblur='check.setoff_border();' oninput='check.set_interest_field();'>";
        document.getElementById("interest_div").innerHTML=code_inside_innerHTML;
    },

    seton_border(){
        document.getElementById("interest_input").parentNode.style.border = '2px solid rgb(86, 167, 86)';
    },

    setoff_border(){
        document.getElementById("interest_input").parentNode.style.border = '1px solid #c2bfbf';
    },

    delete_interest(){
        user.interests.splice(event.target.name,1);
        this.draw_interest_tag();
    },

    change_to_mutable(){
        //delete keycode : 46
        //backspace keycode : 8
        if (document.getElementById("interest_input").value == '' && (event.which == 8 || event.which == 46)){
            let last_tag = user.interests.pop();
            if (last_tag == undefined)   return;

            this.draw_interest_tag();
            let interest_input = document.getElementById("interest_input");
            interest_input.value = last_tag;

            if (event.which == 8)   //backspace하면 한글자 지워지기 때문에 한글자 추가
                interest_input.value += ' ';

            document.getElementById("interest_input").focus();
        }
    },

    check_tag_quantity(){
        if (user.interests.length < 3)
            document.getElementById("interests_p").innerHTML=err_msg.under_msg['interest_fail'];
        else
            document.getElementById("interests_p").innerHTML="";        
    },
    pop_up_element(element, setting){
        document.getElementById(element).style.display = setting;
    },

    hide_element(element){
        document.getElementById(element).style.display = 'none';
    },

    check_bottom_or_not(){
        let agreement_textarea = document.getElementById("agreement_textarea");
        let terms_popup_agreement_button = document.getElementById("terms_popup_agreement_button");
        if (agreement_textarea.scrollHeight - 1 <= agreement_textarea.scrollTop + agreement_textarea.clientHeight){
            terms_popup_agreement_button.disabled = false;
            terms_popup_agreement_button.style.backgroundColor = 'rgb(86, 167, 86)';
        }
    },

    set_checkbox(){
        document.getElementById("terms_popup_div").style.display = 'none';
        document.getElementById("agreement_checkbox").checked = true;
    },

    reset_all_input(){
        let all_inputs = document.getElementsByClassName("text_input");
        for (let i=0; i<all_inputs.length; i++){
            all_inputs[i].value = '';
        }

        let all_p = document.getElementsByTagName("p");
        for (let i=0; i<all_p.length; i++){
            all_p[i].innerHTML = '';
        }

        Object.keys(user).forEach(element => {
            user.element = null;
        });
        user.interests = [];
        document.getElementById("agreement_checkbox").checked = false;

        this.draw_interest_tag();
        this.hide_element('reset_div');
    },

    press_submit_button(){
        let all_inputs = document.getElementsByClassName("text_input");
        let alert_div = document.getElementById("alert_div");
        let alert_span = document.getElementById("alert_span");
        for (let i=0; i<all_inputs.length-1; i++){  //관심사 제외
            if (all_inputs[i].value == ''){
                alert_div.style.display = 'flex';
                alert_span.innerHTML = err_msg.empty[all_inputs[i].id];
                return 0;
            }
        }

        let all_p = document.getElementsByTagName("p");
        for (let i=0; i<all_p.length-1; i++){
            if (!(all_p[i].innerHTML == '' || all_p[i].childNodes[0].className == 'pass')){
                alert_div.style.display = 'flex';
                alert_span.innerHTML = err_msg.validation[all_p[i].id];
                return 0;
            }
        }

        if (user.interests.length < 3){
            alert_div.style.display = 'flex';
            alert_span.innerHTML = err_msg.validation['interest_p'];
            return 0;
        }

        if (document.getElementById("agreement_checkbox").checked == false ){
            alert_div.style.display = 'flex';
            alert_span.innerHTML = err_msg.validation['agreement_p'];
            return 0;
        }

        user.gender = document.getElementById("gender_input").value;   
        user.name = document.getElementById("name_input").value;
        return 1;
    },
    render_page(){
        if (/sign_up$/.test(document.URL)){
            this.switch_page(['signin_page','main_page'],['signup_page']);
        }
        else if (/main$/.test(document.URL)){
            this.switch_page(['signin_page','signup_page'],['main_page']);
        }
        else{
            this.switch_page(['signup_page','main_page'],undefined,['signin_page']);
        }
    },

    //1st element - display:none으로 할 요소들을 배열로 줌
    //2nd element - display:inline
    //3rd element - display:flex
    switch_page(none,inline,flex){
        let elements = [none, inline, flex];
        let properties = ['none','inline','flex'];
        for (let i=0; i<elements.length; i++){
            if (elements[i] == undefined) continue;
            for (let j=0; j<elements[i].length; j++){
                document.getElementById(elements[i][j]).style.display = properties[i];
            }
        }
    },

    make_alert(){
        if (/signin_error/.test(document.URL)){
            alert('아이디나 비밀번호가 일치하지 않습니다.');
            document.getElementById('signout_form').submit();
        }
    }
}
