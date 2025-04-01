/* MAX length Varibles*/
/**  Maximum length of 30 characters */
export const MAX_30 = 30; 
/**  Maximum length of 40 characters */
export const MAX_40 = 40;
/**  Maximum length of 500 characters*/
export const MAX_500 = 500;
/**  Maximum length of 1000 characters*/
export const MAX_1000 = 1000;
/**  Maximum length of 2000 characters*/
export const MAX_2000 = 2000;
/**  Maximum length of 200 characters*/
export const MAX_200 = 200;
/**  Maximum length of 100 characters*/
export const MAX_100 = 100;
/**  Maximum length of 60 characters*/
export const MAX_60 = 60;
/**  Maximum length of 20 characters*/
export const MAX_20 = 20;
/**  Maximum length of 10 characters*/
export const MAX_10 = 10;
/**  Maximum length of 15 characters*/
export const MAX_15 = 15;
/**  Maximum length of 4 characters*/
export const MAX_4 = 4;
/**  Maximum length of 5 characters*/
export const MAX_5 = 5;
/**  Maximum length of 3 characters*/
export const MAX_3 = 3;
/**  Maximum length of 32 characters*/
export const MAX_32 = 32;
/**  Maximum length of 50 characters*/
export const MAX_50 = 50;
/**  Maximum length of 300 characters*/
export const MAX_300 = 300;
/**  Maximum length of 13 characters*/
export const MAX_13 = 13;
/**  Maximum length of 6 characters*/
export const MAX_6 = 6;
/**  Maximum length of 7 characters*/
export const MAX_7 = 7;
/**  Maximum length of 8 characters*/
export const MAX_8 = 8;
/**  Maximum length of 11 characters */
export const MAX_11 = 11;
/**  Maximum length of 12 characters*/
export const MAX_12 = 12;
/**  Maximum length of 25 characters*/
export const MAX_25 = 25;
/**  Maximum length of 32 characters*/
export const PASSWORD = 32;
/**
 * 
 */
/* pattern use for validation */
/**  NAME pattern is used for validation in specilstMaster and CategoryMaster*/
export const NAME = /^([a-zA-Z][a-zA-Z\s]*)$/;
/** STATE_NAME pattern is used for validation */
export const STATE_NAME = /^([a-zA-Z][a-zA-Z\s]*)$/;
/**  CITY_NAME pattern is used for validation*/
export const CITY_NAME = /^([a-zA-Z][a-zA-Z\s]*)$/;
/**LANGUAGE_NAME pattern is used for validation */
export const LANGUAGE_NAME = /^([a-zA-Z][a-zA-Z\s]*)$/;
/** ONLY_NUMBERS pattern allows only numeric characters */
export const ONLY_NUMBERS = /^[0-9]*$/; 
//   export const  ONLY_NUMBERS_AND_DOT = /^[0-9.]{1,15}$/;
/** ONLY_NUMBERS_AND_DOT pattern allows numeric characters and dots */
export const ONLY_NUMBERS_AND_DOT = /^[0-9]+(?:\.[0-9]+)?$/;
/** ONLY_ALPHABETS_AND_DOT pattern allows alphabets, spaces, and dots */ 
export const ONLY_ALPHABETS_AND_DOT = /^([a-zA-Z][a-zA-Z\s\.]*)$/; 
/** PATTERN_FOR_ALPHABATES_AND_SPACE_AND_DASH_DIGIT pattern allows alphanumeric characters, spaces, dashes*/
export const PATTERN_FOR_ALPHABATES_AND_SPACE_AND_DASH_DIGIT =
  /^[a-zA-Z0-9- ]*$/;
  /**    PATTERN_FOR_ALPHABATES_AND_SPACE_AND_DASH allows alphabets, spaces, and dashes   */ 
export const PATTERN_FOR_ALPHABATES_AND_SPACE_AND_DASH = /^[a-zA-Z- ]*$/; 
//   export const  PATTERN_FOR_ALPHABATES_AND_SPACE_AND_ROUND_BRACKETS = /^[a-zA-Z() ]*$/;
/**   PATTERN_FOR_ALPHABATES_AND_SPACE_AND_ROUND_BRACKETS allows alphabets, spaces, and round brackets */
export const PATTERN_FOR_ALPHABATES_AND_SPACE_AND_ROUND_BRACKETS = /^([a-zA-Z()][a-zA-Z() ]*)/;
/**  LAB_MASTER_NAME ensures that the string has at least one non-whitespace character */
export const LAB_MASTER_NAME = /.*\S.*/; 
  // export const  ONLY_SPACE_NOT_ALLOW = /^\S*$/;



/**ONLY_SPACE_NOT_ALLOW ensures that the string has at least one non-whitespace character*/
export const ONLY_SPACE_NOT_ALLOW = /.*\S.*/;
/**   LEADING_SPACE_NOT_ALLOW ensures that the string doesn't start with a space */
export const LEADING_SPACE_NOT_ALLOW = /^([a-zA-Z0-9][a-zA-Z0-9\s]*)/; 
/** PATTERN_FOR_USER_ROLE_NAME ensures that the user role name starts with an alphabet,
and can include alphabets, underscores, and spaces. */
export const PATTERN_FOR_USER_ROLE_NAME = /^([a-zA-Z][a-zA-Z[\_\]\s]*)$/;


/** PATTERN_FOR_PREFIX ensures that a prefix starts with an alphanumeric character,
and can include alphanumeric characters, spaces, and certain special characters.
This is useful for validating prefixes in various contexts.*/
export const PATTERN_FOR_PREFIX = /^([a-zA-Z0-9][a-zA-Z0-9\s!@#$%^&*()-_]*)/;

/** STARTING_WITH_ALPHABATES_AND_DIGIT ensures that a string starts with either an alphabet or a digit,
and may contain a mix of alphanumeric characters, underscores, special characters, and spaces.
This pattern is suitable for validating strings with a specific starting character set. */
export const STARTING_WITH_ALPHABATES_AND_DIGIT =
  /^(\w|\d)([A-z\d_@.#$=!%^)(\]:\*;\?\/\,}{ '\|<>\[&\+-]*)$/;

/**   PATTERN_FOR_ALPHANUMERIC_DIGIT_SPECIAL_ESCAPE_CHARS allows any string that contains at least one non-whitespace character.
It's a general-purpose pattern useful when you want to ensure that a string is not empty and contains some content.
Adjust or replace this pattern based on specific requirements for your use case. */
export const PATTERN_FOR_ALPHANUMERIC_DIGIT_SPECIAL_ESCAPE_CHARS = /.*\S.*/;

/**  PATTERN_FOR_ONLY_ALPHABATES allows only alphabetic characters (both uppercase and lowercase) in the string.
It ensures that the string contains no digits, special characters, or whitespace. */
export const PATTERN_FOR_ONLY_ALPHABATES = /^[a-zA-Z]*$/;

/** PATTERN_FOR_ALPHABATES_AND_SPACE_AND_DIGIT allows alphanumeric characters (both uppercase and lowercase) and spaces in the string.
It ensures that the string contains no special characters or symbols, only letters, numbers, and spaces. */
export const PATTERN_FOR_ALPHABATES_AND_SPACE_AND_DIGIT = /^[a-zA-Z0-9 ]*$/;

/**  PATTERN_FOR_ALPHABATES_AND_DIGIT allows alphanumeric characters (both uppercase and lowercase) in the string.
It ensures that the string contains no spaces, special characters, or symbols, only letters and numbers. */
export const PATTERN_FOR_ALPHABATES_AND_DIGIT = /^[a-zA-Z0-9]*$/;

/**  PATTERN_FOR_ALPHABATES_AND_SPACE allows only alphabetic characters (both uppercase and lowercase) in the string.
The string may start with a single letter, followed by zero or more letters and spaces.
Ensure that there are no special characters, numbers, or leading/trailing spaces. */
export const PATTERN_FOR_ALPHABATES_AND_SPACE = /^([a-zA-Z][a-zA-Z ]*)$/;

/** PATTERN_FOR_ALPHABATES_AND_ORG_NAME allows only alphabetic characters (both uppercase and lowercase) in the string.
The string may start with a single letter, followed by zero or more letters, spaces, dots, ampersands, dollar signs, or at symbols.
Ensure that there are no special characters at the beginning, numbers, or leading/trailing spaces. */
export const PATTERN_FOR_ALPHABATES_AND_ORG_NAME = /^([a-zA-Z][a-zA-Z .&$@]*)$/;

/**PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE allows alphanumeric characters (both uppercase and lowercase) in the string.
The string must start with a single alphanumeric character, followed by zero or more alphanumeric characters or spaces.
Ensure that there are no special characters at the beginning, and leading/trailing spaces are not allowed. */
export const PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE =
  /^([a-zA-Z0-9][a-zA-Z0-9 ]*)/;
//   export const  PATTERN_FOR_EMAIL = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


/**  PATTERN_FOR_EMAIL is a regular expression for basic email validation.
It checks for the presence of local part (username) followed by the '@' symbol,
a valid domain name, and a top-level domain (TLD) with a minimum length of 2 characters. */
export const PATTERN_FOR_EMAIL =
  /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,50}/;

/**  PATTERN_EMAIL is a regular expression for comprehensive email validation.
It checks for the correct structure of an email address, including the local part,
domain, and top-level domain (TLD). This pattern provides more detailed validation
compared to the basic email pattern (PATTERN_FOR_EMAIL). */
export const PATTERN_EMAIL =
  /^(([^<>()[\]\.,;:!#$%^&*+={}/?\s@\"]+(\.[^<>()[\]\.,;:!#$%^&*+={}/?\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:!#$%^&*+={}/?\s@\"]+\.)+[^<>()[\]\.,;:!#$%^&*+={}/?\s@\"]{2,})$/i;
/**  PATTERN_FOR_EMAIL_OR_PHONE_NO is a regular expression for flexible validation of
either an email address or a phone number. It allows checking for a valid email address
or a phone number with 10 to 13 digits. Modify or replace this pattern based on your
specific requirements for email or phone number validation. */
export const PATTERN_FOR_EMAIL_OR_PHONE_NO =
  /^(?:([a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3})|([0-9]{10,13}))$/;

/** PATTERN_FOR_EMAIL_OR_USERNAME is a regular expression for flexible validation of
either an email address or a username. It allows checking for a valid email address
or a username containing alphanumeric characters. Modify or replace this pattern based on
your specific requirements for email or username validation. */
export const PATTERN_FOR_EMAIL_OR_USERNAME =
  /^(?:([a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5})|([a-zA-Z0-9]*))$/;


/** PATTERN_FOR_PHONE_NO is a regular expression for validating a 10-digit phone number.
It ensures that the input consists of exactly 10 numeric digits. Adjust or replace
this pattern based on your specific requirements for phone number validation. */
export const PATTERN_FOR_PHONE_NO = /^[0-9]{10}$/;
// export const PATTERN_FOR_PHONE_NO = /^[6-9]\d{9}$/;
// export const PATTERN_FOR_PHONE_NO =/^[(\()\s.\-\d\)]{10,15}$/;

/** PATTERN_FOR_NUMBER_COMMA is a regular expression for validating a string
that may contain only numeric digits and commas. It allows for numbers
separated by commas, such as in a numeric list. */
export const PATTERN_FOR_NUMBER_COMMA = /^[0-9,]*$/;
/** PATTERN_FOR_DECIMAL_NUMBER is a regular expression for validating a string
that may contain only numeric digits and optional decimal points. It allows
for decimal numbers, such as integers or floating-point numbers. */
export const PATTERN_FOR_DECIMAL_NUMBER = /^[0-9.]*$/;
// export const PATTERN_FOR_PINCODE = /^[0-9]{6}$/;

/** PATTERN_FOR_PINCODE is a regular expression for validating PIN codes. It allows
for alphanumeric characters, spaces, parentheses, dots, hyphens, and can have
a maximum length of 7 characters. Customize as needed for your specific use case. */
export const PATTERN_FOR_PINCODE = /^[(\()\s.\-\d\)]{0,7}$/;

/** PATTERN_FOR_LANDLINE_NO is a regular expression for validating landline phone numbers.
It allows only numeric digits and enforces a fixed length of 11 digits. Customize
as needed for your specific use case. */
export const PATTERN_FOR_LANDLINE_NO = /^[0-9]{11}$/;

// export const PATTERN_FOR_ADHARCARD_NO = /^[0-9]{12}$/;

/** PATTERN_FOR_ADHARCARD_NO is a regular expression for validating Aadhar card numbers.
It ensures that the Aadhar card number starts with a digit between 2 and 9, followed
by seven numeric digits, and ends with four numeric digits. Customize as needed. */

export const PATTERN_FOR_ADHARCARD_NO = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
/** WEBSITE_PATTERN is a regular expression for validating URLs. It supports both http
and https protocols, allows optional 'www.' subdomains, and ensures that the domain
has at least two characters. Customize as needed for your specific use case. */
export const WEBSITE_PATTERN =
  /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/;

/** PATTERN_FOR_HSN_CODE is a regular expression for validating HSN (Harmonized System
of Nomenclature) codes. It allows exactly eight numeric digits. Customize as needed. */
export const PATTERN_FOR_HSN_CODE = /^[0-9]{8}$/;

/** PATTERN_FOR_SAC_CODE is a regular expression for validating SAC (Service Accounting
Code) codes. It allows exactly six numeric digits. Customize as needed. */
export const PATTERN_FOR_SAC_CODE = /^[0-9]{6}$/;
/** PATTERN_FOR_PANCARD_NO is a regular expression for validating PAN (Permanent Account
Number) card numbers. It enforces a pattern of five uppercase alphabets, followed
by four numeric digits, and ends with one uppercase alphabet. Customize as needed. */

export const PATTERN_FOR_PANCARD_NO = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/** PATTERN_FOR_NOTARY_CERTIFICATE_NUMBER is a regular expression for validating notary
certificate numbers. It enforces a pattern of two uppercase alphabets, followed by
four numeric digits, a forward slash (/), and another four numeric digits.
Customize as needed. */
export const PATTERN_FOR_NOTARY_CERTIFICATE_NUMBER = /[A-Z]{2}\d{4}[\/]\d{4}/;

/** PATTERN_FOR_DRIVING_LICENCE_NUMBER is a regular expression for validating driving
licence numbers. It enforces a pattern of two uppercase alphabets, followed by
thirteen numeric digits. Customize as needed. */
export const PATTERN_FOR_DRIVING_LICENCE_NUMBER = /[A-Z]{2}\d{13}/;

/** PATTERN_FOR_NAME_WITH_COMA_AND_SPACE is a regular expression for validating names
that allow alphabets, commas, and spaces. It enforces the name to start with an
alphabet. Customize as needed. */
export const PATTERN_FOR_NAME_WITH_COMA_AND_SPACE = /^([a-zA-Z][a-zA-Z, ]*)$/;

/** PATTERN_FOR_NAME_WITH_DASH_SLASH_AND_SPACE is a regular expression for validating
names that allow alphabets, dashes, slashes, and spaces. It enforces the name to start
with an alphabet. Customize as needed. */
export const PATTERN_FOR_NAME_WITH_DASH_SLASH_AND_SPACE =
  /^([a-zA-Z][a-zA-Z-/ ]*)$/;

/** PATTERN_FOR_NAME_WITH_COMA_CIRCLE_BRACKETS is a regular expression for validating
names that allow alphabets, commas, parentheses, and spaces. It enforces the name to
start with an alphabet. Customize as needed. */
export const PATTERN_FOR_NAME_WITH_COMA_CIRCLE_BRACKETS =
  /^([a-zA-Z][a-zA-Z,() ]*)$/;

/** PATTERN_FOR_NAME_WITH_EMPERSON_AND_SPACE is a regular expression for validating
names that allow alphabets, ampersands (&), and spaces. It enforces the name to start
with an alphabet. Customize as needed. */
export const PATTERN_FOR_NAME_WITH_EMPERSON_AND_SPACE =
  /^([a-zA-Z][a-zA-Z& ]*)$/;

//   export const PATTERN_FOR_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,32}$/;


/** PATTERN_FOR_PASSWORD is a regular expression for validating passwords. It allows
alphanumeric characters (both uppercase and lowercase) and enforces a length between
6 and 32 characters. Customize as needed. */
export const PATTERN_FOR_PASSWORD = /^[a-zA-Z0-9]{6,32}$/;
//   export const PATTERN_FOR_PASSWORD = /^(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,32}$/;

/** PATTERN_FOR_PASSWORD_NEW is a regular expression for validating stronger passwords.
It enforces the use of lowercase letters, digits, and special characters, with a
length between 8 and 15 characters. Customize as needed. */
export const PATTERN_FOR_PASSWORD_NEW =
  /^(?=.*[a-z])(?=.*[a-z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;
/** PATTERN_FOR_BAR_COUNCIL_NO is a regular expression for validating bar council
numbers. It enforces a pattern of two uppercase alphabets, a forward slash (/),
followed by optional digits, another forward slash (/), and four numeric digits.
Customize as needed. */
export const PATTERN_FOR_BAR_COUNCIL_NO =
  /[a-zA-Z]{2}[\/]\d[0-9]{0,5}[\/][0-9]{4}/;

/** PATTERN_FOR_GST_NO is a regular expression for validating Goods and Services Tax
(GST) numbers. It enforces a specific pattern of digits and uppercase alphabets.
Customize as needed. */
export const PATTERN_FOR_GST_NO =
  /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;

/** PATTERN_FOR_NUMBER_PLATE is a regular expression for validating vehicle number
plates. It enforces a pattern that typically represents a combination of alphabets,
numbers, and optional spaces or hyphens. Customize as needed. */
export const PATTERN_FOR_NUMBER_PLATE =
  /^[a-zA-Z]{2}[ -][0-9]{1,2}(?: [a-zA-Z])?(?: [a-zA-Z]*)? [0-9]{4}$/;
/** PATTERN_NOT_ALLOW_SPACE is a regular expression for ensuring that a string does not
contain any whitespace characters. Customize as needed. */
export const PATTERN_NOT_ALLOW_SPACE = /^\S*$/;

/** PATTERN_FOR_DATE is a regular expression for validating date strings in the format
DD/MM/YYYY. It considers different month lengths and leap years. Customize as needed. */
export const PATTERN_FOR_DATE =
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
/** PATTERN_FOR_IFSC_CODE is a regular expression for validating Indian Financial System
Code (IFSC) numbers. It enforces a specific pattern of uppercase alphabets and digits.
Customize as needed. */
export const PATTERN_FOR_IFSC_CODE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
/** PATTERN_FOR_ACCOUNT_NUMBER is a regular expression for validating account numbers.
It enforces a pattern of digits with a length between 9 and 18. Customize as needed. */
export const PATTERN_FOR_ACCOUNT_NUMBER = /^\d{9,18}$/;





/* Validation Message */
/**  PASSWORD_INVALID is a string message describing the criteria for a valid password.
Customize the message based on your specific password policy. */
export const PASSWORD_INVALID = 'Should contains 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special (*,@,$)';
/** CONFIRM_PASSWORD_NOT_MATCHED is a string message indicating that the entered password
and the confirmed password do not match. Adjust the message as needed. */
export const CONFIRM_PASSWORD_NOT_MATCHED = 'Password and Confirm password not equal.';


//console remove  console\.log\(.+?\);