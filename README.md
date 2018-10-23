# form-validator
A JavaScript validation utility for HTML based forms. Worked in React, Angular, Preact, Vue and any other front-end library.

## Install

```
npm install form-validator --save
```

## Uses

### React
```
import Validator from 'form-validator';


componentDidMount(){
  this.form = new Validator('userForm'); // name of the form
}

onSubmit(event) {
  event.preventDefault();

  if(!this.form.isDirty()) {
    this.form.validate();
  }

  if(this.form.valid()) {
    const data = this.form.data();

    // use form data {name: '', email: ''}
  }
}

render() {
  return (
    <form className="myform" name="userForm" onSubmit={this.onSubmit.bind(this)}>
      <label>Name</label>
      <input type="text" name="name" data-validate="required" />

      <label>Email</label>
      <input type="email" name="email" data-validate="required, email" />
    </form>
  )
}
```

### Angular
```
// user-form.html

<form className="myform" name="userForm" (submit)="onSubmit($event)">
  <label>Name</label>
  <input type="text" name="name" data-validate="required" />

  <label>Email</label>
  <input type="email" name="email" data-validate="required, email" />
</form>

// user-form.component.ts

import Validator from 'form-validator';

userForm: any = null;

ngOnInit(){
  this.userForm = new Validator('userForm');
}

onSubmit(event){
  event.preventDefault();

  if(!this.form.isDirty()) {
    this.form.validate();
  }

  if(this.form.valid()) {
    const data = this.form.data();

    // use form data {name: '', email: ''}
  }
}

```

## API

### `check`
Check if an elemement is valid

__Uses__

```
.check('element_name') // return true/false
```
### `valid`

Return true if form is valid

__Uses__

```
.valid() // returns true/false
```

### `validate`

Initiate the validation manually

__Uses__

```
.validate(); // initiate the validation
```

### `isDirty`

Check if form is dirty (touched by user)

__Uses__

```
.isDirty() // returns true/false
```

### `data`

Return form data as object

__Uses__

```
.data(); // returns {key: value} object of form elements

```

### `reset`

Reset the form (removes okay and error classes from input/select/textarea elements)

__Uses__

```
.reset(); // reset the form and removes the css classes
```