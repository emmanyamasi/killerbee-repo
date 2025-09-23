USER CASE DIAGRAM

ACTORS
R&D Department

Test Department

Factory Employees




[ R&D ] ───> (Manage Models)
         └──> (Manage Ingredients)
         └──> (Design Processes)
         
[ Test Dept ] ───> (Validate Tests)
                └──> (Search Processes)

[ Factory ] ───> (Implement Processes)
              └──> (Search Models)



1. Roles in the system
// LOGIN WITH ID
From your brief, the main user groups are:

R&D Department

Tasks: design processes, define ingredients, add/modify models.

Needs access to Models, Ingredients, and Processes.

Test Department

Tasks: validate processes, run/approve tests.

Needs access to Processes and Tests.

Factory Employees

Tasks: follow procedures to manufacture products.

Needs read-only access to Models and Processes (cannot modify).

IT Admins (support role)

Tasks: manage users, set permissions, backups, system monitoring.

Needs full admin rights (but this is more on infrastructure).