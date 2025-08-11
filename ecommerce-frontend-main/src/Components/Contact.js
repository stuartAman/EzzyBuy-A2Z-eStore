import React from 'react';
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from "@mui/material/Link";

const Contact = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Contact Us
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Aman Gangwar
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Link
                                    href="https://www.linkedin.com/in/aman-gangwar-33a13a142/"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <IconButton size="small">
                                        <LinkedInIcon />
                                    </IconButton>
                                </Link>
                                <Link
                                    href="https://github.com/stuartAman"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <IconButton size="small">
                                        <GitHubIcon />
                                    </IconButton>
                                </Link>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Contact;
