
import * as React from "react";
/** Function to map a value from one range to another  */
function map(value, start1, stop1, start2, stop2) {
    return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}
/** Function to get the byte length of a string  */
const getByteLength = (string: string): number => {
    return new TextEncoder().encode(string[0])[0];
};
/** Determine the byte values of 'a' and 'z' */
const minCharByteValue: number = getByteLength("a");
const maxCharByteValue: number = getByteLength("z");
/** Normalize the byte values to a range of [0, 1]  */
const minRange: number = minCharByteValue / maxCharByteValue;
const maxRange: number = 1;
/** Function to generate initials from first and last names */
const initials = (firstname: string, lastname: string) =>
    (firstname[0] + lastname[0]).toUpperCase();
/**Function to calculate color based on user data  */
const colorByUser = ({ firstName, lastName, email }: IUser): string => {
    const userValue =
        getByteLength(firstName[0].toLowerCase()) /
        getByteLength(lastName[0].toLowerCase());

    return `hsl(${map(userValue, minRange, maxRange, 0, 360)},50%,50%)`;
};
/**  Interface for User object*/
interface IUser {
    firstName: string;
    lastName: string;
    email: string;
}
/**Interface for component props  */
interface IProps {
    user: IUser;
}
/**
 * Avatar component renders an avatar with initials and background color based on user data.
 *
 * @param user User data including firstName, lastName, and email.
 */
export const Avatar: React.FC<IProps> = ({
    user: { firstName, lastName, email }
}) => {
    return (
        <div
            className="avatar-initials"
            style={{ backgroundColor: colorByUser({ firstName, lastName, email }) }}
        >
            {initials(firstName, lastName)}
        </div>
    );
};