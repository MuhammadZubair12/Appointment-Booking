frappe.ready(async () => {
    initialise_select_date();
})

window.holiday_list = [];

async function initialise_select_date() {
    navigate_to_page(1);
    await get_global_variables();
    setup_date_picker();
    setup_timezone_selector();
    hide_next_button();
}

async function get_global_variables() {
    // Using await through this file instead of then.
    window.appointment_settings = (await frappe.call({
        method: 'erpnext.www.book_appointment.index.get_appointment_settings'
    })).message;
    window.timezones = (await frappe.call({
        method:'erpnext.www.book_appointment.index.get_timezones'
    })).message;
    window.holiday_list = window.appointment_settings.holiday_list;
}

function setup_timezone_selector() {
    let timezones_element = document.getElementById('appointment-timezone');
    let local_timezone = moment.tz.guess()
    window.timezones.forEach(timezone => {
        let opt = document.createElement('option');
        opt.value = timezone;
        if (timezone == local_timezone) {
            opt.selected = true;
        }
        opt.innerHTML = timezone;
        timezones_element.appendChild(opt)
    });
}

function setup_date_picker() {
    let date_picker = document.getElementById('appointment-date');
    let today = new Date();
    date_picker.min = today.toISOString().substr(0, 10);
    today.setDate(today.getDate() + window.appointment_settings.advance_booking_days);
    date_picker.max = today.toISOString().substr(0, 10);
}

function hide_next_button() {
    let next_button = document.getElementById('next-button');
    next_button.disabled = true;
    next_button.onclick = () => frappe.msgprint(__("Please select a date and time"));
}

function show_next_button() {
    let next_button = document.getElementById('next-button');
    next_button.disabled = false;
    next_button.onclick = setup_details_page;
}

function show_next_page() {
    let next_page0 = document.getElementById('next-page0');
    next_page0.disabled = false;
}

function datapage() {
    navigate_to_page(2)
}

function previousPage() {
    navigate_to_page(1)

}

function on_date_or_timezone_select() {
    let date_picker = document.getElementById('appointment-date');
    let timezone = document.getElementById('appointment-timezone');
    if (date_picker.value === '') {
        clear_time_slots();
        hide_next_button();
        frappe.throw(__('Please select a date'));
    }
    window.selected_date = date_picker.value;
    window.selected_timezone = timezone.value;
    update_time_slots(date_picker.value, timezone.value);
    let lead_text = document.getElementById('lead-text');
    lead_text.innerHTML = "Select Time"
}

async function get_time_slots(date, timezone) {
    let slots = (await frappe.call({
        method: 'erpnext.www.book_appointment.index.get_appointment_slots',
        args: {
            date: date,
            timezone: timezone
        }
    })).message;
    return slots;
}

async function services() {
    var select = document.getElementById('avail-service');
    var value = select.options[select.selectedIndex].value;

    if (value == "Select") {
        let pa = document.getElementById('abc');
        pa.innerHTML = ''
    } else {
        window.data = await get_avail_services(value)
        let pa = document.getElementById('abc');
        pa.innerHTML = ''
        window.data.forEach((slot, index) => {
       

            // Get and append timeslot div
            // console.log("Service", slot)
            pa.innerHTML += ` 
            {% set currencysymbal = frappe.db.get_single_value('Global Defaults', 'default_currency') %}
           
                    <div class="col-md-4 col-sm-6 princing-item green" style="margin-bottom: 7%">
                        <div class="pricing-divider ">
                            <h3 class="text-light">${slot.name}</h3>
            
                            <svg class='pricing-divider-img' enable-background='new 0 0 300 100' height='100px' id='Layer_1'
                                preserveAspectRatio='none' version='1.1' viewBox='0 0 300 100' width='300px' x='0px'
                                xml:space='preserve' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg'
                                y='0px'>
                                <path class='deco-layer deco-layer--1' d='M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729
            c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z' fill='#FFFFFF' opacity='0.6'></path>
                                <path class='deco-layer deco-layer--2' d='M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729
            c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z' fill='#FFFFFF' opacity='0.6'></path>
                                <path class='deco-layer deco-layer--3' d='M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716
            H42.401L43.415,98.342z' fill='#FFFFFF' opacity='0.7'></path>
                                <path class='deco-layer deco-layer--4' d='M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428
            c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z' fill='#FFFFFF'></path>
                            </svg>
                        </div>
                        <div class="card-body bg-white mt-0 shadow" style="border-bottom-left-radius: 4% !important;border-bottom-right-radius: 4% !important;">
                            <ul class="list-unstyled mb-5 position-relative" style="font-size: 12px;margin-bottom: 10% !important;">
                                <li><b>Duration</b> ${slot.duration}</li>
                                <li><b>Consultant</b> ${slot.service_provider}</li>
                                <li><b>Price </b>  ${slot.price}<span style="color: #3096f3;
                                font-weight: bold;
                                margin-left: 2px;">{{currencysymbal}}<span></li>
                                
                            </ul>
                            <div class="price-value" id="pack-price" onclick="onClick(event)">

                
                            <button type="button" id="btn_ss" class="btn btn-lg btn-block btn-custom" onclick="package(${JSON.stringify(slot).split('"').join("&quot;")})">Buy
                            </button>
                          
                            </div>
                            
                        </div>
                    </div>
                







        `
        });
    }
   

}
// function myFunction(x) {
//     x.classList.toggle("fa-check");
//   }
async function services_orignal() {
    var select = document.getElementById('avail-service');
    var value = select.options[select.selectedIndex].value;

    if (value == "Select") {
        let pa = document.getElementById('abc');
        pa.innerHTML = ''
    } else {
        window.data = await get_avail_services(value)
        let pa = document.getElementById('abc');
        pa.innerHTML = ''
        window.data.forEach((slot, index) => {
       

            // Get and append timeslot div
            // console.log("Service", slot)
            pa.innerHTML += ` 
            {% set currencysymbal = frappe.db.get_single_value('Global Defaults', 'default_currency') %}
            <div class="col-md-4 col-sm-6" style="    margin-bottom: 7%;
            ">
            <div class="pricingTable">
                <h3 class="title"><span>${slot.name}</span></h3>
                <ul class="pricing-content">
                    <li><i class="fa fa-check"></i> <span style="color: rgb(77, 77, 240);">Provider:</span> ${slot.service_provider}</li>
                    <li><i class="fa fa-check"></i> <span style="color: rgb(77, 77, 240);">Duration:</span> <span style="color:green">${slot.duration} Minutes</span> </li>
                </ul>
                

                <div class="price-value" id="pack-price" onclick="onClick(event)">

                
                    <a class="pricingTable-signup" onclick="package(${JSON.stringify(slot).split('"').join("&quot;")})">Buy</a>
                    <span class="amount">
                    {{currencysymbal}} ${slot.price} <span></span>
                    </span>
                </div>
            </div>
        </div>`
        });
    }
   

}

function onClick(e){
    e.preventDefault()
    let a = document.querySelector('.active');
    let btnactive = document.querySelector('.btnactive');
    if (a) {
        a.classList.remove('active')
    } else {}
    if (btnactive) {
        a.classList.remove('btnactive')
    } else {}
    // document.querySelector('.active').classList.remove('active')
    e.target.classList.add('active')
    e.target.classList.add('btnactive')
    show_next_page()
}

function package(slot) {
    // console.log("Slot am", slot.price)
    var btn_ss = document.getElementById('btn_ss');
    let da = document.getElementById('duration-value');
    let na = document.getElementById('name-value');
    let pika = document.getElementById('pika');
    let service_provider = document.getElementById('service_provider');
    let appointment_title = document.getElementById('appointment_title');
    da.innerHTML = slot.duration
    na.innerHTML = slot.name
    pika.innerHTML = slot.price
    service_provider.innerHTML = slot.service_provider
    appointment_title.innerHTML = slot.name
   
}

async function get_avail_services(name) {
    let servicess = (await frappe.call({
        method: 'appointment_booking.www.new_book_appointment.index.get_services',
        args: {
            name:name
        }
    })).message;

    return servicess;
}

async function update_time_slots(selected_date, selected_timezone) {
    let timeslot_container = document.getElementById('timeslot-container');
    window.slots = await get_time_slots(selected_date, selected_timezone);
    clear_time_slots();
    if (window.slots.length <= 0) {
        let message_div = document.createElement('p');
        message_div.innerHTML = "There are no slots available on this date";
        timeslot_container.appendChild(message_div);
        return
    }
    window.slots.forEach((slot, index) => {
        // Get and append timeslot div
        let timeslot_div = get_timeslot_div_layout(slot)
        timeslot_container.appendChild(timeslot_div);
    });
    set_default_timeslot();
}

function get_timeslot_div_layout(timeslot) {
    let start_time = new Date(timeslot.time)
    let timeslot_div = document.createElement('div');
    timeslot_div.classList.add('time-slot');
    if (!timeslot.availability) {
        timeslot_div.classList.add('unavailable')
    }
    timeslot_div.innerHTML = get_slot_layout(start_time);
    timeslot_div.id = timeslot.time.substring(11, 19);
    timeslot_div.addEventListener('click', select_time);
    return timeslot_div
}

function clear_time_slots() {
    // Clear any existing divs in timeslot container
    let timeslot_container = document.getElementById('timeslot-container');
    while (timeslot_container.firstChild) {
        timeslot_container.removeChild(timeslot_container.firstChild);
    }
}

function get_slot_layout(time) {
    let timezone = document.getElementById("appointment-timezone").value;
    time = new Date(time);
    let start_time_string = moment(time).tz(timezone).format("LT");
    let end_time = moment(time).tz(timezone).add(window.appointment_settings.appointment_duration, 'minutes');
    let end_time_string = end_time.format("LT");
    return `<span style="font-size: 1.2em;">${start_time_string}</span><br><span class="text-muted small">to ${end_time_string}</span>`;
}

function select_time() {
    if (this.classList.contains('unavailable')) {
        return;
    }
    let selected_element = document.getElementsByClassName('selected');
    if (!(selected_element.length > 0)) {
        this.classList.add('selected');
        show_next_button();
        return;
    }
    selected_element = selected_element[0]
    window.selected_time = this.id;
    selected_element.classList.remove('selected');
    this.classList.add('selected');
    show_next_button();
}

function set_default_timeslot() {
    let timeslots = document.getElementsByClassName('time-slot')
    // Can't use a forEach here since, we need to break the loop after a timeslot is selected
    for (let i = 0; i < timeslots.length; i++) {
        const timeslot = timeslots[i];
        if (!timeslot.classList.contains('unavailable')) {
            timeslot.classList.add('selected');
            break;
        }
    }
}

function navigate_to_page(page_number) {
    let page0 = document.getElementById('service_contaiber');
    let page1 = document.getElementById('select-date-time');
    let page2 = document.getElementById('enter-details');
    switch (page_number) {
        case 1:
            page1.style.display = 'none';
            page2.style.display = 'none';
            page0.style.display = 'block';
            break;
        case 2:
            page0.style.display = 'none';
            page2.style.display = 'none';
            page1.style.display = 'block';
            break;
        case 3:
            page0.style.display = 'none';
            page1.style.display = 'none';
            page2.style.display = 'block';
            break;
        default:
            break;
    }
}
function gotoDatepage(){
    navigate_to_page(1)
}

function servicesone() {
   
}

function setup_details_page() {
    navigate_to_page(3)
    let date_container = document.getElementsByClassName('date-span')[0];
    let time_container = document.getElementsByClassName('time-span')[0];
    setup_search_params();
    date_container.innerHTML = moment(window.selected_date).format("MMM Do YYYY");
    time_container.innerHTML = moment(window.selected_time, "HH:mm:ss").format("LT");
}

function setup_search_params() {
    let search_params = new URLSearchParams(window.location.search);
    let customer_name = search_params.get("name")
    let customer_email = search_params.get("email")
    let detail = search_params.get("details")
    if (customer_name) {
        let name_input = document.getElementById("customer_name");
        name_input.value = customer_name;
        name_input.disabled = true;
    }
    if(customer_email) {
        let email_input = document.getElementById("customer_email");
        email_input.value = customer_email;
        email_input.disabled = true;
    }
    if(detail) {
        let detail_input = document.getElementById("customer_notes");
        detail_input.value = detail;
        detail_input.disabled = true;
    }
}
async function submit() {
    let button = document.getElementById('submit-button');
    let duration = document.getElementById('duration-value');
    let username = document.getElementById('name-value');
    let pika = document.getElementById('pika');
    let service_provider = document.getElementById('service_provider');
    let appointment_title = document.getElementById('appointment_title');
    button.disabled = true;
    let form = document.querySelector('#customer-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        button.disabled = false;
        return;
    }
    let contact = get_form_data();
    let appointment =  frappe.call({
        method: 'erpnext.www.book_appointment.index.create_appointment',
        args: {
            'date': window.selected_date,
            'time': window.selected_time,
            'contact': contact,
            'tz':window.selected_timezone,
            'service_provider':service_provider,
            'appointment_title':appointment_title,
            'duration': duration,
            'pika': pika
        },
        callback: (response)=>{
            if (response.message.status == "Unverified") {
                frappe.show_alert("Please check your email to confirm the appointment")
            } else {
                frappe.show_alert("Appointment Created Successfully");
            }
            setTimeout(()=>{
                let redirect_url = "/";
                if (window.appointment_settings.success_redirect_url){
                    redirect_url += window.appointment_settings.success_redirect_url;
                }
                window.location.href = redirect_url;},5000)
        },
        error: (err)=>{
            frappe.show_alert("Something went wrong please try again");
            button.disabled = false;
        }
    });
}


function afterpayment() {
    alert("Pay")
}


function payNow(e) {
    e.preventDefault();
    // console.log("AM",document.getElementById("pika").textContent)
    FlutterwaveCheckout({
      public_key: document.getElementById("public_key").value,
      tx_ref: "ak_"+Math.floor((Math.random()*1000000000)+1),
      amount: document.getElementById("pika").textContent,
      currency: document.getElementById("currency").value,
      customer: {
        email: document.getElementById("customer_email").value,
        name: document.getElementById("customer_name").value,
      },
      callback:function(data) {
          const reference = data.tx_ref;
          if (data.status == "successful") {
            submit();
          } else {
              alert("Unsuccessfull Please check the Information")
          }
      },
      customizations: {
        title: "The Champions",
        description: "Payment",
        logo: "",
      },
    });
  }

function get_form_data() {
    contact = {};
    let inputs = ['name', 'number', 'notes', 'email'];
    inputs.forEach((id) => contact[id] = document.getElementById(`customer_${id}`).value)
    return contact
}

document.addEventListener('contextmenu',(e)=>{
    e.preventDefault();
  }
  );
  document.onkeydown = function(e) {
  if(event.keyCode == 123) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
     return false;
  }
  if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
     return false;
  }
}
