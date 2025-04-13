import IconButton, {IconButtonProps} from "@mui/material/IconButton";
import {styled} from "@mui/material/styles";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}
// Раскрыть текст статьи
export const ExpandMore = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'expand',
})<ExpandMoreProps>(({ theme, expand }) => ({
    marginLeft: 'auto',
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));
export default ExpandMore;
