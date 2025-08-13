
import { Container } from "@mui/material";



export default function PageHeader({title, children: description}) {
    return (
      <Container maxWidth="md">
      <header>
          <h1
            style={{
              color: '#555',
              fontSize: '24px',
              fontWeight: '600'
            }}
          >
            {title}
          </h1>
          <p
            style={
              {
                fontWeight: '300',
                fontSize: '16px'
              }
            }
          >
            {description}
          </p>
      </header>
      </Container>
    );
  }
  