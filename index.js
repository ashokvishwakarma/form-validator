/**
 * Validator
 * 
 * Form Validaton class
 * 
 * const form = new Validator('<form_name>');
 * 
 * Check individual element
 * form.check('element_name') 
 * 
 * Check if form is valid
 * form.valid()
 * 
 * Get form data in object format
 * form.data()
 * 
 * Validate form
 * form.validate()
 * 
 * Initalise / Check the form dirty state
 * form.isDirty()
 * 
 * Reset form to original state
 * form.reset()
 * 
 * If form is valid
 * form.valid
 * 
 * If form is chaged bu user
 * form.dirty
 */
class Validator{
  
  /**
   * fields
   * 
   * form fields map
   */
  fields = {}

  /**
   * rules
   * 
   * regex rules for various types of validation
   */
  rules = {
    email: {
      type: 'regex',
      regex: /^[a-z0-9][a-z0-9-_\.]+@[a-z0-9][a-z0-9-]+[a-z0-9]\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
    },
    password: {
      type: 'func',
      method: '_password'
    },
    alphabet: {
      type: 'regex',
      regex: /^[a-zA-Z ]+$/
    },
    alphanumeric: {
      type: 'regex',
      regex: /^[a-zA-Z0-9]/
    },
    url: {
      type: 'regex',
      regex: /^(https?):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/
    }
  }

  /**
   * constructor
   * 
   * Validation constructor
   * @param {string} form 
   */
  constructor(form){
    /**
     * setting the form using name
     */
    this.form = document.forms[form] || null;

    /**
     * throw an error if form is not found
     */
    if(!this.form) {
      throw new Error('Form is not available in document.');
    }

    /**
     * iterating all the form elements 
     * to populate the desired data
     */
    [].forEach.call(document.forms[form], element => {
      /**
       * ignore submit and reset types
       */
      if(element.type === 'submit' || element.type === "reset") return;

      /**
       * adding form element to fields
       */
      this.fields[element.name] = {
        element: element,
        rule: element.getAttribute('data-validate'),
        value: element.value,
        same: element.getAttribute('data-same'),
        who: element.name,
        dirty: false,
        valid: false
      };

      /**
       * bind events on form elements
       */
      this._bind_events(element);
    });

    /**
     * make other method private
     */
    return {
      check: this.check.bind(this),
      valid: this.valid.bind(this),
      validate: this.validate.bind(this),
      isDirty: this.isDirty.bind(this),
      data: this.data.bind(this),
      reset: this.reset.bind(this)
    }
  }

  /**
   * reset
   * 
   * Reset form to its initial state
   * Remove all the classes added by validation 
   */
  reset() {
    Object.keys(this.fields).forEach(name => {
      this.fields[name].element.classList.remove('error', 'okay');
    });

    /**
     * original form reset
     */
    this.form.reset();
  }

  /**
   * data
   * 
   * Get the form data in object format
   * 
   * Form element name will be the key for each value
   */
  data(){
    let data = {};
    Object.keys(this.fields).forEach(name => {
      data[name] = this.fields[name].value.trim();
      this.fields[name].dirty = false;
    });

    return data;
  }

  /**
   * isDirty
   * 
   * Initialise and check if form is dirty
   */
  isDirty(){
    let isDirty = true;

    Object.keys(this.fields).forEach(name => {
      if(!this.fields[name].dirty) isDirty = false;
    });

    return isDirty;
  }

  /**
   * validate
   * 
   * Validate abstruction
   */
  validate(){
    return this._check_all();
  }

  /**
   * valid
   * 
   * Check if form is valid
   */
  valid(){
    let isValid = true;

    Object.keys(this.fields).forEach(name => {
      if(!this.fields[name].valid) isValid = false;
    });

    return isValid;

  }

  /**
   * check
   * 
   * Check is a single element is valid
   * name must be a valid form element name
   * @param {string} name 
   */
  check(name){
    if(name) return this._check_one(name);

    return this._validate_all();
  }

  /**
   * _check_one
   * 
   * check single form element 
   * @access private
   * @param {string} name 
   */
  _check_one(name){
    return this._check_field(this.fields[name]);
  }

  /**
   * _check_all
   * 
   * check all element
   * @access private
   */
  _check_all(){
    Object.keys(this.fields).forEach(name => {
      this.fields[name].isDirty = true;
      this._blur(this.fields[name]);
    });
  }

  /**
   * _check_field
   * 
   * check single field for validation
   * @param {any} field 
   */
  _check_field(field){

    /**
     * get the current field value
     */
    field.value = field.element.value;

    /**
     * default is valid
     */
    let isValid = true;

    /**
     * get the rule regex
     */
    let rules = (field.rule) ? field.rule.split(",") : [];

    /**
     * test and match all the rules
     */
    rules.forEach(rule => {
      let param = this.rules[rule.trim()] || false;

      if(!param && rule.trim() === "required" && field.value.trim() === ""){
        isValid = false;
      }else if(!param && rule.trim() === "allow-blank" && field.value.trim() === ""){
        isValid = true;
      }else if(param && param.type === 'regex' && !param.regex.test(field.value.trim())){
        isValid = false;
      }else if(param && param.type === 'func' && this[param.func] && !this[param.func].call(this, field.value.trim())){
        isValid = false;
      }

      if(field.same && this.fields[field.same].value.trim() !== field.value) isValid = false;
    })

    return isValid;
  }

  /**
   * _bind_events
   * 
   * Bind events to the form element
   * @access private
   * @param {*} element 
   */
  _bind_events(element){
    element.addEventListener("blur", this._blur.bind(this, this.fields[element.name]));
    element.addEventListener("focus", this._focus.bind(this, this.fields[element.name]));
  }

  /**
   * _password
   * 
   * custom method vbalidation
   * @access private
   * @param {string} value 
   */
  _password(value){
    
  }

  /**
   * _blur
   * 
   * Handle blur on form elements
   * @access private 
   * @param {*} field 
   */
  _blur(field){
    if(!this._check_field(field)){
      field.element.classList.remove('okay');
      field.element.classList.add('error');
      field.valid = false;
    }else{
      field.element.classList.remove('error');
      field.element.classList.add('okay');
      field.valid = true;
    }
  }

  /**
   * _focus
   * 
   * Handle focus form element event
   * @access private
   * @param {*} field 
   */
  _focus(field){
    field.element.classList.remove('error', 'okay');
  }
}

export default Validator;