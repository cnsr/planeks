# DOUBLE_QUTATIONS = '"'
# SINGLE_QUOTATIONS = "'"
DOUBLE_QUTATIONS = "double"
SINGLE_QUOTATIONS = "single"


# COMMA_DELIMITER = ","
# SEMICOLON_DELIMITER = ";"
# COLON_DELIMITER = ":"
# TAB_DELIMITER = "{Tab}"
# SPACE_DELIMITER = "{space}"
COMMA_DELIMITER = "comma"
SEMICOLON_DELIMITER = "semicolon"
COLON_DELIMITER = "colon"
TAB_DELIMITER = "tab"
SPACE_DELIMITER = "space"

field_delimiter_choices = [
    (COMMA_DELIMITER, "comma"),
    (SEMICOLON_DELIMITER, "semicolon"),
    (COLON_DELIMITER, "colon"),
    (TAB_DELIMITER, "tab"),
    (SPACE_DELIMITER, "space"),
]

string_delimiter_choices = [
    (DOUBLE_QUTATIONS, "double"),
    (SINGLE_QUOTATIONS, "single"),
]

FULLNAME_COLUMN = "fullname"
JOB_COLUMN = "job"
EMAIL = "email"
DOMAIN_COLUMN = "domain"
PHONE_COLUMN = "phone"
COMPANY_COLUMN = "company"
# TEXT = "text"
INTEGER_COLUMN = "integer"
ADDRESS_COLUMN = "address"
DATE_COLUMN = "date"

column_types = [
    (FULLNAME_COLUMN, FULLNAME_COLUMN),
    (JOB_COLUMN, JOB_COLUMN),
    (EMAIL, EMAIL),
    (DOMAIN_COLUMN, DOMAIN_COLUMN),
    (PHONE_COLUMN, PHONE_COLUMN),
    (COMPANY_COLUMN, COMPANY_COLUMN),
    (INTEGER_COLUMN, INTEGER_COLUMN),
    (ADDRESS_COLUMN, ADDRESS_COLUMN),
    (DATE_COLUMN, DATE_COLUMN),
]

types_with_range = (INTEGER_COLUMN,)

delimiters = {
    DOUBLE_QUTATIONS: '"',
    SINGLE_QUOTATIONS: "'",
    COMMA_DELIMITER: ",",
    COLON_DELIMITER: ":",
    SEMICOLON_DELIMITER: ";",
    TAB_DELIMITER: "\t",
    SPACE_DELIMITER: " ",
}
